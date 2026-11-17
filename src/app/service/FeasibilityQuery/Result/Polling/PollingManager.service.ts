import { ErrorQueryResult } from 'src/app/model/Result/ErrorQueryResult'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { Injectable, inject } from '@angular/core'
import { PollingService } from './Polling.service'
import { QueryResult } from 'src/app/model/Result/QueryResult'
import { QueryResultData } from 'src/app/model/Interface/QueryResultData'
import { QueryResultMapperService } from '../Mapping/QueryResultMapper.service'
import {
  Observable,
  Subject,
  switchMap,
  takeUntil,
  interval,
  timer,
  endWith,
  exhaustMap,
  map,
} from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PollingManagerService {
  private pollingService = inject(PollingService)
  private queryResultMapperService = inject(QueryResultMapperService)

  private stopPolling$ = new Subject<void>()

  /**
   * Initiates polling for the feasibility query.
   * Emits one result per poll, then `null` to mark the end of polling.
   */
  public getPollingResult(
    feasibilityQuery: FeasibilityQuery
  ): Observable<QueryResult | ErrorQueryResult | null> {
    return this.pollingService.getFeasibilityIdFromPollingUrl(feasibilityQuery).pipe(
      switchMap((resultId) => {
        feasibilityQuery.addResultId(resultId)
        return this.pollingProcess(resultId, feasibilityQuery.getId())
      })
    )
  }

  /**
   * Polls the summary result until the max polling time or a stop signal.
   * exhaustMap skips a tick while a request is still running, so results cannot arrive out of order.
   */
  private pollingProcess(
    resultId: string,
    feasibilityQueryId: string
  ): Observable<QueryResult | ErrorQueryResult | null> {
    return interval(this.pollingService.getPollingInterval()).pipe(
      takeUntil(timer(this.pollingService.getPollingTime() + 200)),
      exhaustMap(() => this.pollingService.requestSummaryResult(resultId)),
      map((result: QueryResultData) =>
        result?.issues?.length
          ? this.queryResultMapperService.createErrorQueryResult(result.issues, feasibilityQueryId)
          : this.queryResultMapperService.createQueryResult(false, result, feasibilityQueryId)
      ),
      takeUntil(this.stopPolling$),
      endWith(null)
    )
  }

  /**
   * Stops polling by emitting a signal.
   */
  public stopPolling(): void {
    this.stopPolling$.next()
  }
}
