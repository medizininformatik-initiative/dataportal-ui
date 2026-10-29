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

  public getDetailedResultRateLimit(): Observable<QueryResultRateLimit> {
    return this.obfuscatedResultRateLimitService.getRateLimit()
  }

  public refreshResultRateLimit(): void {
    return this.obfuscatedResultRateLimitService.refreshRateLimit()
  }

  public doSendQueryRequest(): Observable<QueryResult> {
    this.appSettingsProviderService.getPollingTimeUi()
    this.obfuscatedResultRateLimitService.refreshRateLimit()

    return this.activeFeasibilityQuery().pipe(
      switchMap((feasibilityQuery) => {
        const result = this.pollingManagerService.getPollingResult(feasibilityQuery)
        return this.setProvider(result)
      })
    )
  }

  public getDetailedObfuscatedResult(feasibilityQueryResultId: string): Observable<QueryResult> {
    return this.activeFeasibilityQuery().pipe(
      switchMap((feasibilityQuery: FeasibilityQuery) => {
        const result = this.obfuscatedResultService.getDetailedObfuscatedResult(feasibilityQueryResultId, feasibilityQuery.getId())
        return this.setProvider(result)
      })
    )
  }

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

  private activeFeasibilityQuery(): Observable<FeasibilityQuery> {
    return this.queryProviderService.getActiveFeasibilityQuery()
  }

  private setQueryResultProvider(queryResult: QueryResult): void {
    this.resultProvider.setOne(queryResult)
  }

  public stopPolling(): void {
    this.pollingManagerService.stopPolling()
  }
}
