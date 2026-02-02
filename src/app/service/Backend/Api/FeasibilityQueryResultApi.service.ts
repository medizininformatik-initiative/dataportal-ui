import { BackendService } from '../Backend.service';
import { FeasibilityQueryPaths } from '../Paths/FeasibilityQueryPaths';
import { FeasibilityQueryResultPaths } from '../Paths/FeasibilityQueryResultsPaths';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryResultRateLimit } from 'src/app/model/Result/QueryResultRateLimit';

@Injectable({
  providedIn: 'root',
})
export class FeasibilityQueryResultApiService {
  private resultObservable = null;

  constructor(private backendService: BackendService, private http: HttpClient) {}

  public getSummaryResult(feasibilityQueryResultId: string): Observable<any> {
    const url =
      FeasibilityQueryPaths.getBaseUrl() +
      '/' +
      feasibilityQueryResultId +
      FeasibilityQueryResultPaths.SUMMARY_RESULT;
    const result = this.http.get<any>(this.backendService.createUrl(url), {
      context: BackendService.getFeasibilityRequestContextToken(),
    });
    return this.createReplySubject(result);
  }

  public getDetailedResult(resultUrl: string, gottenDetailedResult: boolean): Observable<any> {
    if (gottenDetailedResult) {
      return this.resultObservable;
    }

    const result = this.http.get<any>(resultUrl, {
      context: BackendService.getFeasibilityRequestContextToken(),
    });

    return Observable.create((obs: any) => {
      result.subscribe(
        (queryResult) => {
          this.resultObservable = Observable.create((queryResultObs: any) => {
            queryResultObs.next(queryResult);
            queryResultObs.complete();
          });
          obs.next(queryResult);
          obs.complete();
        },
        (error) => {
          this.resultObservable = Observable.create((innerObs: any) => {
            innerObs.error(error);
            innerObs.complete();
          });
          obs.error(error);
          obs.complete();
        }
      );
    });
  }

  public getDetailedResultRateLimit(): Observable<any> {
    const url =
      FeasibilityQueryResultPaths.getBaseUrl() +
      FeasibilityQueryResultPaths.DETAILED_OBFUSCATED_RESULT_RATE_LIMIT;
    return this.http.get<QueryResultRateLimit>(this.backendService.createUrl(url), {
      context: BackendService.getFeasibilityRequestContextToken(),
    });
  }

  public getDetailedObfuscatedResult(feasibilityQueryResultId: string): Observable<any> {
    const url =
      FeasibilityQueryResultPaths.getBaseUrl() +
      '/' +
      feasibilityQueryResultId +
      FeasibilityQueryResultPaths.DETAILED_OBFUSCATED_RESULT;
    return this.http.get<any>(this.backendService.createUrl(url), {
      context: BackendService.getFeasibilityRequestContextToken(),
    });
  }

  private createReplySubject(result: any): Observable<any> {
    return Observable.create((obs: any) => {
      result.subscribe(
        (queryResult) => {
          this.resultObservable = Observable.create((queryResultObs: any) => {
            queryResultObs.next(queryResult);
            queryResultObs.complete();
          });
          obs.next(queryResult);
          obs.complete();
        },
        (error) => {
          this.resultObservable = Observable.create((innerObs: any) => {
            innerObs.error(error);
            innerObs.complete();
          });
          obs.error(error);
          obs.complete();
        }
      );
    });
  }
}
