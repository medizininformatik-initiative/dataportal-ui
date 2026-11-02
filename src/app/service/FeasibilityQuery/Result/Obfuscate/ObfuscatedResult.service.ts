import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { QueryResult } from 'src/app/model/Result/QueryResult'
import { FeasibilityQueryResultApiService } from '../../../Backend/Api/FeasibilityQueryResultApi.service'
import { QueryResultMapperService } from '../Mapping/QueryResultMapper.service'

@Injectable({
  providedIn: 'root',
})
export class ObfuscatedResultService {
  private readonly feasibilityQueryResultApiService = inject(FeasibilityQueryResultApiService)
  private readonly queryResultMapperService = inject(QueryResultMapperService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Fetches the detailed obfuscated result and maps it to a query result.
   * @param {string} feasibilityQueryResultId
   * @param {string} feasibilityQueryId
   * @returns {Observable<QueryResult>}
   */
  public getDetailedObfuscatedResult(feasibilityQueryResultId: string, feasibilityQueryId: string): Observable<QueryResult> {
    return this.feasibilityQueryResultApiService
      .getDetailedObfuscatedResult(feasibilityQueryResultId)
      .pipe(map((result) => this.mapQueryResult(result, feasibilityQueryId)))
  }

  /**
   * Maps the response to a detailed query result.
   * @param {any} result
   * @param {string} feasibilityQueryId
   * @returns {QueryResult}
   */
  private mapQueryResult(result, feasibilityQueryId: string): QueryResult {
    const queryResult: QueryResult = this.queryResultMapperService.createQueryResult(true, result, feasibilityQueryId)
    return queryResult
  }
}
