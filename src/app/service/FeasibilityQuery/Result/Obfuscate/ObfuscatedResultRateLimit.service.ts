import { Injectable, inject } from '@angular/core'
import { BehaviorSubject, map, Observable, shareReplay, switchMap } from 'rxjs'
import { QueryResultRateLimit } from 'src/app/model/Result/QueryResultRateLimit'
import { FeasibilityQueryResultApiService } from 'src/app/service/Backend/Api/FeasibilityQueryResultApi.service'

@Injectable({
  providedIn: 'root',
})
export class ObfuscatedResultRateLimitService {
  private readonly feasibilityQueryResultApiService = inject(FeasibilityQueryResultApiService)

  private readonly updateTrigger$ = new BehaviorSubject<void>(undefined)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Fetches, caches, and provides the latest rate limit.
   */
  private readonly rateLimit$: Observable<QueryResultRateLimit> = this.updateTrigger$.pipe(
    switchMap(() =>
      this.feasibilityQueryResultApiService.getDetailedResultRateLimit().pipe(map((result) => this.createResultRateLimit(result)))
    ),
    shareReplay(1)
  )

  private createResultRateLimit(result: any): QueryResultRateLimit {
    return new QueryResultRateLimit(result.limit, result.remaining)
  }

  /**
   * Public getter to expose the latest rate limit.
   * @returns {Observable<QueryResultRateLimit>}
   */
  public getRateLimit(): Observable<QueryResultRateLimit> {
    return this.rateLimit$
  }

  /**
   * Manually triggers an update for the rate limits.
   */
  public refreshRateLimit(): void {
    this.updateTrigger$.next()
  }
}
