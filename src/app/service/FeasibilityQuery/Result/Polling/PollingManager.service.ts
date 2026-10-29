import { Injectable, inject } from '@angular/core'
import { Observable, Subject, switchMap, takeUntil, interval, timer, endWith, mergeMap, map } from 'rxjs'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { ErrorQueryResult } from 'src/app/model/Result/ErrorQueryResult'
import { QueryResult } from 'src/app/model/Result/QueryResult'
import { QueryResultMapperService } from '../Mapping/QueryResultMapper.service'
import { PollingService } from './Polling.service'

@Injectable({
  providedIn: 'root',
})
export class PollingManagerService {
  private readonly pollingService = inject(PollingService)
  private readonly queryResultMapperService = inject(QueryResultMapperService)

  private stopPolling$ = new Subject<void>()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Initiates polling for the feasibility query.
   * @param {FeasibilityQuery} feasibilityQuery
   * @returns {Observable<QueryResult | ErrorQueryResult>}
   */
  public getPollingResult(feasibilityQuery: FeasibilityQuery): Observable<QueryResult | ErrorQueryResult> {
    return this.pollingService
      .getFeasibilityIdFromPollingUrl()
      .pipe(switchMap((resultId: string) => this.startPolling(feasibilityQuery, resultId)))
  }

  /**
   * Starts polling for the given feasibility query result ID.
   * @param {FeasibilityQuery} feasibilityQuery
   * @param {string} resultId
   * @returns {Observable<QueryResult | ErrorQueryResult>}
   */
  private startPolling(feasibilityQuery: FeasibilityQuery, resultId: string): Observable<QueryResult | ErrorQueryResult> {
    feasibilityQuery.addResultId(resultId)
    this.resetStopSignal()
    return this.pollingProcess(resultId, feasibilityQuery.getId())
  }

  /**
   * Handles the polling process and error handling.
   * @param {string} resultId
   * @param {string} feasibilityQueryId
   * @returns {Observable<QueryResult | ErrorQueryResult | null>}
   */
  private pollingProcess(resultId: string, feasibilityQueryId: string): Observable<QueryResult | ErrorQueryResult | null> {
    let lastValidResult: QueryResult | null = null
    let lastError: ErrorQueryResult | null = null

    return interval(this.pollingService.getPollingInterval()).pipe(
      takeUntil(timer(this.pollingService.getPollingTime() + 200)),
      mergeMap(() =>
        this.requestPollingResult(resultId).pipe(
          map((result) => {
            if (result?.issues) {
              lastError = this.queryResultMapperService.createErrorQueryResult(result.issues, feasibilityQueryId)
              return lastError
            } else {
              lastValidResult = this.queryResultMapperService.createQueryResult(false, result, feasibilityQueryId)
              lastError = null
              return lastValidResult
            }
          })
        )
      ),
      takeUntil(this.stopPolling$),
      endWith(lastValidResult ?? lastError ?? null)
    )
  }

  /**
   * Requests polling results and handles errors.
   * @param {string} resultId
   * @returns {Observable<any>}
   */
  private requestPollingResult(resultId: string): Observable<any> {
    return this.pollingService.requestSummaryResult(resultId)
  }

  /**
   * Stops polling by emitting a signal.
   */
  public stopPolling(): void {
    this.stopPolling$.next()
  }

  /**
   * Resets the stop signal if the current subject is closed.
   */
  private resetStopSignal(): void {
    if (this.stopPolling$.closed) {
      this.stopPolling$ = new Subject<void>()
    }
  }
}
