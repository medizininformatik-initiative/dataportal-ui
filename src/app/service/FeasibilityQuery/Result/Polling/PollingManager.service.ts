import { ErrorQueryResult } from 'src/app/model/Result/ErrorQueryResult'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { Injectable, inject } from '@angular/core'
import { PollingService } from './Polling.service'
import { QueryResult } from 'src/app/model/Result/QueryResult'
import { QueryResultMapperService } from '../Mapping/QueryResultMapper.service'
import {
  EMPTY,
  Observable,
  catchError,
  endWith,
  exhaustMap,
  interval,
  map,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PollingManagerService {
  private pollingService = inject(PollingService)
  private queryResultMapperService = inject(QueryResultMapperService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Initiates polling for the feasibility query. Unsubscribing stops the polling.
   */
  public getPollingResult(
    feasibilityQuery: FeasibilityQuery
  ): Observable<QueryResult | ErrorQueryResult | null> {
    return this.pollingService
      .getFeasibilityIdFromPollingUrl(feasibilityQuery)
      .pipe(switchMap((resultId) => this.startPolling(feasibilityQuery, resultId)))
  }

  /**
   * Starts polling for the given feasibility query result ID.
   */
  private startPolling(
    feasibilityQuery: FeasibilityQuery,
    resultId: string
  ): Observable<QueryResult | ErrorQueryResult | null> {
    feasibilityQuery.addResultId(resultId)
    return this.pollingProcess(resultId, feasibilityQuery.getId())
  }

  /**
   * Polls until the polling time is over. `exhaustMap` skips a tick while a request is pending,
   * so responses cannot overtake each other. A failed request skips its tick, polling goes on.
   * Last emission is `null`: the end marker `SimpleResultComponent` pairs with the last result.
   */
  private pollingProcess(
    resultId: string,
    feasibilityQueryId: string
  ): Observable<QueryResult | ErrorQueryResult | null> {
    return interval(this.pollingService.getPollingInterval()).pipe(
      takeUntil(timer(this.pollingService.getPollingTime() + 200)),
      exhaustMap(() =>
        this.pollingService.requestSummaryResult(resultId).pipe(
          map((result) =>
            result?.issues
              ? this.queryResultMapperService.createErrorQueryResult(
                  result.issues,
                  feasibilityQueryId
                )
              : this.queryResultMapperService.createQueryResult(false, result, feasibilityQueryId)
          ),
          catchError(() => EMPTY)
        )
      ),
      endWith(null)
    )
  }
}
