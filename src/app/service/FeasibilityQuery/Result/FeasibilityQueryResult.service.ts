import { AppSettingsProviderService } from '../../Config/AppSettingsProvider.service'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { FeasibilityQueryProviderService } from '../../Provider/FeasibilityQueryProvider.service'
import { Injectable, inject, signal } from '@angular/core'
import {
  asapScheduler,
  catchError,
  map,
  Observable,
  of,
  scheduled,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs'
import { ObfuscatedResultRateLimitService } from './Obfuscate/ObfuscatedResultRateLimit.service'
import { ObfuscatedResultService } from './Obfuscate/ObfuscatedResult.service'
import { PollingManagerService } from './Polling/PollingManager.service'
import { QueryResult } from '../../../model/Result/QueryResult'
import { QueryResultRateLimit } from '../../../model/Result/QueryResultRateLimit'
import { ResultProviderService } from '../../Provider/ResultProvider.service'

interface SentQuery {
  key: string
  result?: QueryResult
  receivedAt?: number
  complete: boolean
}

export interface DetailError {
  code: string
  retryAfterSeconds?: number
  until: number
}

@Injectable({
  providedIn: 'root',
})
export class FeasibilityQueryResultService {
  private queryProviderService = inject(FeasibilityQueryProviderService)
  private pollingManagerService = inject(PollingManagerService)
  private resultProvider = inject(ResultProviderService)
  private appSettingsProvider = inject(AppSettingsProviderService)
  private obfuscatedResultRateLimitService = inject(ObfuscatedResultRateLimitService)
  private obfuscatedResultService = inject(ObfuscatedResultService)

  /** Seconds left until a new query may be sent after a 429 Retry-After, 0 when free. */
  readonly sendBlockedSeconds = signal(0)
  private sendBlockTimer?: ReturnType<typeof setInterval>

  /** Last sent query. Leaving and re-entering the result page with unchanged criteria shows it again instead of sending anew (each send counts against the create quota). */
  private lastSent?: SentQuery

  /** Result ids whose detail request failed, mapped to the error code. Prevents repeat calls (each one counts against the rate limit). */
  private failedDetails = new Map<string, DetailError>()

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
    this.obfuscatedResultRateLimitService.refreshRateLimit()

    return this.activeFeasibilityQuery().pipe(
      take(1),
      switchMap((feasibilityQuery) => {
        const key = JSON.stringify([
          feasibilityQuery.getInclusionCriteria(),
          feasibilityQuery.getExclusionCriteria(),
        ])
        const reusable = this.lastSent
        if (reusable?.key === key && reusable.complete && this.remainingExpiryMs() > 0) {
          // Same stream shape as a finished poll: last result, then the end marker `null`.
          // Async: emitting inside change detection of the result page changes its parent (NG0100).
          return scheduled([reusable.result as QueryResult, null], asapScheduler)
        }
        const sent: SentQuery = { key, complete: false }
        this.lastSent = sent
        const result = this.pollingManagerService.getPollingResult(feasibilityQuery).pipe(
          tap((response) => {
            if (response === null) {
              sent.complete = !!sent.result
            } else if (
              !response.getIssues().length &&
              response.getTotalNumberOfPatients() != null
            ) {
              sent.result = response as QueryResult
              sent.receivedAt ??= Date.now()
            }
          })
        )
        return this.setProvider(result as Observable<QueryResult>)
      }),
      catchError((error) => {
        if (error?.retryAfterSeconds) {
          this.startSendBlock(error.retryAfterSeconds)
        }
        return throwError(() => error)
      })
    )
  }

  /**
   * Time the last result stays valid in the backend: it expires from its first result on.
   */
  public remainingExpiryMs(): number {
    const received = this.lastSent?.receivedAt ?? Date.now()
    return Math.max(
      0,
      received + this.appSettingsProvider.getQueryResultExpiry() * 1000 - Date.now()
    )
  }

  private startSendBlock(seconds: number): void {
    clearInterval(this.sendBlockTimer)
    this.sendBlockedSeconds.set(seconds)
    this.sendBlockTimer = setInterval(() => {
      this.sendBlockedSeconds.update((left) => left - 1)
      if (this.sendBlockedSeconds() <= 0) {
        clearInterval(this.sendBlockTimer)
      }
    }, 1000)
  }

  public getDetailedObfuscatedResult(feasibilityQueryResultId: string): Observable<QueryResult> {
    const received = this.resultProvider.getOne(feasibilityQueryResultId)
    if (received?.getDetailsReceived()) {
      return of(received)
    }
    const failed = this.failedDetails.get(feasibilityQueryResultId)
    if (failed && Date.now() < failed.until) {
      return throwError(() => failed)
    }
    return this.activeFeasibilityQuery().pipe(
      take(1),
      switchMap((feasibilityQuery: FeasibilityQuery) => {
        const result = this.obfuscatedResultService.getDetailedObfuscatedResult(
          feasibilityQueryResultId,
          feasibilityQuery.getId()
        )
        return this.setProvider(result)
      }),
      catchError((error) => {
        const code = error?.payload?.[0]?.code ?? error?.issues?.[0]?.code ?? 'RESULT_FAILED'
        const retryAfterSeconds: number | undefined = error?.retryAfterSeconds
        // Rate limit (429) only blocks for the time the backend names, other errors stay blocked.
        const until = retryAfterSeconds ? Date.now() + retryAfterSeconds * 1000 : Infinity
        const detailError = { code, retryAfterSeconds, until }
        this.failedDetails.set(feasibilityQueryResultId, detailError)
        return throwError(() => detailError)
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
}
