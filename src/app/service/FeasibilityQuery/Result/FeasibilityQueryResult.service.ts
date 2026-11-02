import { Injectable, inject } from '@angular/core'
import { map, Observable, switchMap } from 'rxjs'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { QueryResult } from '../../../model/Result/QueryResult'
import { QueryResultRateLimit } from '../../../model/Result/QueryResultRateLimit'
import { AppSettingsProviderService } from '../../Config/AppSettingsProvider.service'
import { FeasibilityQueryProviderService } from '../../Provider/FeasibilityQueryProvider.service'
import { ResultProviderService } from '../../Provider/ResultProvider.service'
import { ObfuscatedResultService } from './Obfuscate/ObfuscatedResult.service'
import { ObfuscatedResultRateLimitService } from './Obfuscate/ObfuscatedResultRateLimit.service'
import { PollingManagerService } from './Polling/PollingManager.service'

@Injectable({
  providedIn: 'root',
})
export class FeasibilityQueryResultService {
  private readonly appSettingsProviderService = inject(AppSettingsProviderService)
  private readonly queryProviderService = inject(FeasibilityQueryProviderService)
  private readonly pollingManagerService = inject(PollingManagerService)
  private readonly resultProvider = inject(ResultProviderService)
  private readonly obfuscatedResultRateLimitService = inject(ObfuscatedResultRateLimitService)
  private readonly obfuscatedResultService = inject(ObfuscatedResultService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Returns the rate limit for the detailed result.
   * @returns {Observable<QueryResultRateLimit>}
   */
  public getDetailedResultRateLimit(): Observable<QueryResultRateLimit> {
    return this.obfuscatedResultRateLimitService.getRateLimit()
  }

  /**
   * Refreshes the rate limit for the detailed result.
   */
  public refreshResultRateLimit(): void {
    this.obfuscatedResultRateLimitService.refreshRateLimit()
  }

  /**
   * Sends the query request and polls for the result.
   * @returns {Observable<QueryResult>}
   */
  public doSendQueryRequest(): Observable<QueryResult> {
    this.appSettingsProviderService.getPollingTimeUi()
    this.obfuscatedResultRateLimitService.refreshRateLimit()

    return this.activeFeasibilityQuery().pipe(
      switchMap((feasibilityQuery: FeasibilityQuery) => {
        const result = this.pollingManagerService.getPollingResult(feasibilityQuery)
        return this.setProvider(result)
      })
    )
  }

  /**
   * Fetches the detailed obfuscated result of the active feasibility query.
   * @param {string} feasibilityQueryResultId
   * @returns {Observable<QueryResult>}
   */
  public getDetailedObfuscatedResult(feasibilityQueryResultId: string): Observable<QueryResult> {
    return this.activeFeasibilityQuery().pipe(
      switchMap((feasibilityQuery: FeasibilityQuery) => {
        const result = this.obfuscatedResultService.getDetailedObfuscatedResult(feasibilityQueryResultId, feasibilityQuery.getId())
        return this.setProvider(result)
      })
    )
  }

  /**
   * Stores each result with a patient count in the result provider.
   * @param {Observable<QueryResult>} result
   * @returns {Observable<QueryResult>}
   */
  private setProvider(result: Observable<QueryResult>): Observable<QueryResult> {
    return result.pipe(
      map((queryResult: QueryResult) => {
        if (queryResult?.getTotalNumberOfPatients() !== null && queryResult !== null) {
          this.setQueryResultProvider(queryResult)
          return queryResult
        } else {
          return queryResult
        }
      })
    )
  }

  /**
   * Returns the active feasibility query.
   * @returns {Observable<FeasibilityQuery>}
   */
  private activeFeasibilityQuery(): Observable<FeasibilityQuery> {
    return this.queryProviderService.getActiveFeasibilityQuery()
  }

  /**
   * Stores the query result in the result provider.
   * @param {QueryResult} queryResult
   */
  private setQueryResultProvider(queryResult: QueryResult): void {
    this.resultProvider.setOne(queryResult)
  }

  /**
   * Stops the result polling.
   */
  public stopPolling(): void {
    this.pollingManagerService.stopPolling()
  }
}
