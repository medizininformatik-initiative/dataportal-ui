import { Injectable, Query, inject } from '@angular/core'
import { Observable, of, switchMap } from 'rxjs'
import { FeasibilityQuery } from '../model/FeasibilityQuery/FeasibilityQuery'
import { QueryResult } from '../model/Result/QueryResult'
import { SavedFeasibilityQueryResults } from '../model/Result/SavedFeasibilityQueryResults'
import { FeasibilityQueryApiService } from './Backend/Api/FeasibilityQueryApi.service'
import { ActiveFeasibilityQueryService } from './Provider/ActiveFeasibilityQuery.service'
import { FeasibilityQueryProviderService } from './Provider/FeasibilityQueryProvider.service'
import { ResultProviderService } from './Provider/ResultProvider.service'

@Injectable({
  providedIn: 'root',
})
export class SaveFeasibilityQueryModalService {
  private readonly activeFeasibilityQuery = inject(ActiveFeasibilityQueryService)
  private readonly feasibilityQueryProviderService = inject(FeasibilityQueryProviderService)
  private readonly resultProvider = inject(ResultProviderService)
  private readonly feasibilityQueryApiService = inject(FeasibilityQueryApiService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Saves the feasibility query.
   *
   * @param title
   * @param comment
   */
  public saveFeasibilityQuery(title: string, comment: string): Observable<void> {
    return this.activeFeasibilityQuery.getActiveFeasibilityQueryIdObservable().pipe(
      switchMap((id) => this.feasibilityQueryProviderService.getFeasibilityQueryByID(id)),
      switchMap((feasibilityQuery: FeasibilityQuery) => {
        const resultIds: string[] = feasibilityQuery.getResultIds()
        return of(this.resultProvider.getOne(resultIds[resultIds.length - 1]))
      }),
      switchMap((result: QueryResult) => this.saveFeasibilityQueryResult(title, comment, result))
    )
  }

  /**
   * Saves the feasibility query result.
   *
   * @param title
   * @param comment
   * @param result
   */
  private saveFeasibilityQueryResult(title: string, comment: string, result: QueryResult): Observable<void> {
    const savedQuery = new SavedFeasibilityQueryResults(title, comment, result.getTotalNumberOfPatients())
    return this.feasibilityQueryApiService.postSavedFeasibilityQuery(savedQuery, result.getId())
  }
}
