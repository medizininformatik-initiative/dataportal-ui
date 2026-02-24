import { Injectable, Query } from '@angular/core';
import { ActiveFeasibilityQueryService } from './Provider/ActiveFeasibilityQuery.service';
import { FeasibilityQueryProviderService } from './Provider/FeasibilityQueryProvider.service';
import { ResultProviderService } from './Provider/ResultProvider.service';
import { FeasibilityQueryApiService } from './Backend/Api/FeasibilityQueryApi.service';
import { Observable, of, switchMap } from 'rxjs';
import { FeasibilityQuery } from '../model/FeasibilityQuery/FeasibilityQuery';
import { SavedFeasibilityQueryResults } from '../model/Result/SavedFeasibilityQueryResults';
import { QueryResult } from '../model/Result/QueryResult';

@Injectable({
  providedIn: 'root',
})
export class SaveFeasibilityQueryModalService {
  constructor(
    private activeFeasibilityQuery: ActiveFeasibilityQueryService,
    private feasibilityQueryProviderService: FeasibilityQueryProviderService,
    private resultProvider: ResultProviderService,
    private feasibilityQueryApiService: FeasibilityQueryApiService
  ) {}

  public saveFeasibilityQuery(title: string, comment: string): Observable<void> {
    return this.activeFeasibilityQuery.getActiveFeasibilityQueryIdObservable().pipe(
      switchMap((id) => this.feasibilityQueryProviderService.getFeasibilityQueryByID(id)),
      switchMap((feasibilityQuery: FeasibilityQuery) => {
        const resultIds: string[] = feasibilityQuery.getResultIds();
        return of(this.resultProvider.getOne(resultIds[resultIds.length - 1]));
      }),
      switchMap((result: QueryResult) => this.saveFeasibilityQueryResult(title, comment, result))
    );
  }

  private saveFeasibilityQueryResult(
    title: string,
    comment: string,
    result: QueryResult
  ): Observable<void> {
    const savedQuery = new SavedFeasibilityQueryResults(
      title,
      comment,
      result.getTotalNumberOfPatients()
    );
    return this.feasibilityQueryApiService.postSavedFeasibilityQuery(savedQuery, result.getId());
  }
}
