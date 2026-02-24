import { AbstractArrayEntityProvider } from './Abstract/AbstractArrayEntityProvider';
import { Observable, of, switchMap } from 'rxjs';
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery';
import { FeasibilityQueryProviderService } from './FeasibilityQueryProvider.service';
import { Injectable } from '@angular/core';
import { QueryResult } from '../../model/Result/QueryResult';

@Injectable({
  providedIn: 'root',
})
export class ResultProviderService extends AbstractArrayEntityProvider<QueryResult> {
  constructor(private feasibilityQueryProvider: FeasibilityQueryProviderService) {
    super();
  }

  protected selectId(result: QueryResult): string {
    return result.getId();
  }

  public getResultOfActiveFeasibilityQuery(): Observable<QueryResult | undefined> {
    return this.feasibilityQueryProvider
      .getActiveFeasibilityQuery()
      .pipe(switchMap((feasibilityQuery: FeasibilityQuery) => this.getLastResult(feasibilityQuery)));
  }

  private getLastResult(feasibilityQuery: FeasibilityQuery): Observable<QueryResult | undefined> {
    const resultIds = feasibilityQuery.getResultIds();

    if (!resultIds || resultIds.length === 0) {
      return of(undefined);
    }
    const lastResultId = resultIds[resultIds.length - 1];
    return of(this.getOne(lastResultId));
  }
}
