import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { QueryResultRateLimit } from 'src/app/model/Result/QueryResultRateLimit'
import { BackendService } from '../Backend.service'
import { FeasibilityQueryPaths } from '../Paths/FeasibilityQueryPaths'
import { FeasibilityQueryResultPaths } from '../Paths/FeasibilityQueryResultsPaths'

@Injectable({
  providedIn: 'root',
})
export class FeasibilityQueryResultApiService {
  private readonly backendService = inject(BackendService)
  private readonly http = inject(HttpClient)

  private resultObservable = null

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Fetches the summary result of a feasibility query.
   * @param {string} feasibilityQueryResultId
   * @returns {Observable<any>}
   */
  public getSummaryResult(feasibilityQueryResultId: string): Observable<any> {
    const url = FeasibilityQueryPaths.getBaseUrl() + '/' + feasibilityQueryResultId + FeasibilityQueryResultPaths.SUMMARY_RESULT
    const result = this.http.get<any>(this.backendService.createUrl(url), {
      context: BackendService.getFeasibilityRequestContextToken(),
    })
    return this.createReplySubject(result)
  }

  /**
   * Fetches the detailed result, or returns the already running request if it exists.
   * @param {string} resultUrl
   * @param {boolean} gottenDetailedResult
   * @returns {Observable<any>}
   */
  public getDetailedResult(resultUrl: string, gottenDetailedResult: boolean): Observable<any> {
    if (gottenDetailedResult) {
      return this.resultObservable
    }

    const result = this.http.get<any>(resultUrl, {
      context: BackendService.getFeasibilityRequestContextToken(),
    })

    return Observable.create((obs: any) => {
      result.subscribe(
        (queryResult) => {
          this.resultObservable = Observable.create((queryResultObs: any) => {
            queryResultObs.next(queryResult)
            queryResultObs.complete()
          })
          obs.next(queryResult)
          obs.complete()
        },
        (error) => {
          this.resultObservable = Observable.create((innerObs: any) => {
            innerObs.error(error)
            innerObs.complete()
          })
          obs.error(error)
          obs.complete()
        }
      )
    })
  }

  /**
   * Fetches the rate limit for the detailed obfuscated result.
   * @returns {Observable<any>}
   */
  public getDetailedResultRateLimit(): Observable<any> {
    const url = FeasibilityQueryResultPaths.getBaseUrl() + FeasibilityQueryResultPaths.DETAILED_OBFUSCATED_RESULT_RATE_LIMIT
    return this.http.get<QueryResultRateLimit>(this.backendService.createUrl(url), {
      context: BackendService.getFeasibilityRequestContextToken(),
    })
  }

  /**
   * Fetches the detailed obfuscated result of a feasibility query.
   * @param {string} feasibilityQueryResultId
   * @returns {Observable<any>}
   */
  public getDetailedObfuscatedResult(feasibilityQueryResultId: string): Observable<any> {
    const url =
      FeasibilityQueryResultPaths.getBaseUrl() + '/' + feasibilityQueryResultId + FeasibilityQueryResultPaths.DETAILED_OBFUSCATED_RESULT
    return this.http.get<any>(this.backendService.createUrl(url), {
      context: BackendService.getFeasibilityRequestContextToken(),
    })
  }

  /**
   * Wraps the result observable into a new observable that forwards its values and errors.
   * @param {any} result
   * @returns {Observable<any>}
   */
  private createReplySubject(result: any): Observable<any> {
    return Observable.create((obs: any) => {
      result.subscribe(
        (queryResult) => {
          this.resultObservable = Observable.create((queryResultObs: any) => {
            queryResultObs.next(queryResult)
            queryResultObs.complete()
          })
          obs.next(queryResult)
          obs.complete()
        },
        (error) => {
          this.resultObservable = Observable.create((innerObs: any) => {
            innerObs.error(error)
            innerObs.complete()
          })
          obs.error(error)
          obs.complete()
        }
      )
    })
  }
}
