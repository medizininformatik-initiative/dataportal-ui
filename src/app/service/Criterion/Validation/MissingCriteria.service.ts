import { combineLatest, Observable, of } from 'rxjs';
import { CriterionProviderService } from '../../Provider/CriterionProvider.service';
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MissingCriteriaService {
  constructor(private criterionService: CriterionProviderService) {}

  public getMissingCriteria(feasibilityQuery: FeasibilityQuery): Observable<string[]> {
    return combineLatest([
      this.processMissingCriteria(feasibilityQuery.getInclusionCriteria()),
      this.processMissingCriteria(feasibilityQuery.getExclusionCriteria()),
    ]).pipe(map(this.flattenLists));
  }

  private processMissingCriteria(criteriaGroups: string[][]): Observable<string[]> {
    if (!criteriaGroups.length) {
      return of([]);
    }

    const observables = criteriaGroups.map((group) => this.getMissingCriteriaFromGroup(group));
    return combineLatest(observables).pipe(map(this.flattenLists));
  }

  private getMissingCriteriaFromGroup(criteriaGroup: string[]): Observable<string[]> {
    return this.criterionService
      .getAll()
      .pipe(
        map((criterionMap) =>
          criteriaGroup.filter(
            (criterionId) =>
              !criterionMap.find((c) => c.getId() === criterionId)?.getIsRequiredFilterSet()
          )
        )
      );
  }

  private flattenLists(lists: string[][]): string[] {
    return lists.reduce((acc, curr) => acc.concat(curr), []);
  }
}
