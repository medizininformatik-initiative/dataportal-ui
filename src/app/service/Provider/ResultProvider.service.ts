import { Injectable, inject } from '@angular/core'
import { Observable, of, switchMap } from 'rxjs'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { QueryResult } from '../../model/Result/QueryResult'
import { AbstractArrayEntityProvider } from './Abstract/AbstractArrayEntityProvider'
import { FeasibilityQueryProviderService } from './FeasibilityQueryProvider.service'

@Injectable({
  providedIn: 'root',
})
export class ResultProviderService extends AbstractArrayEntityProvider<QueryResult> {
  private readonly feasibilityQueryProvider = inject(FeasibilityQueryProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    super()
  }

  /**
   * Returns the id of the result.
   * @param {QueryResult} result
   * @returns {string}
   */
  protected selectId(result: QueryResult): string {
    return result.getId()
  }

  /**
   * Returns the last result of the active feasibility query.
   * @returns {Observable<QueryResult | undefined>}
   */
  public getResultOfActiveFeasibilityQuery(): Observable<QueryResult | undefined> {
    return this.feasibilityQueryProvider
      .getActiveFeasibilityQuery()
      .pipe(switchMap((feasibilityQuery: FeasibilityQuery) => this.getLastResult(feasibilityQuery)))
  }

  /**
   * Returns the last result of the feasibility query, if there is one.
   * @param {FeasibilityQuery} feasibilityQuery
   * @returns {Observable<QueryResult | undefined>}
   */
  private getLastResult(feasibilityQuery: FeasibilityQuery): Observable<QueryResult | undefined> {
    const resultIds = feasibilityQuery.getResultIds()

    if (!resultIds || resultIds.length === 0) {
      return of(undefined)
    }
    const lastResultId = resultIds[resultIds.length - 1]
    return of(this.getOne(lastResultId))
  }
}
