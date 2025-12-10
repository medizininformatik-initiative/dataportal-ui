import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { CriterionValidationManagerService } from './Validation/CriterionValidationManager.service';
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery';
import { FeasibilityQueryProviderService } from '../Provider/FeasibilityQueryProvider.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FeasibilityQueryValidationService {
  constructor(
    private feasibilityQueryProvider: FeasibilityQueryProviderService,
    private criterionValidationManagerService: CriterionValidationManagerService
  ) {}

  /**
   *
   * @returns Observable<string[]>
   */
  public getMissingRequiredFilterCriteria(): Observable<string[]> {
    return this.getActiveFeasibilityQuery().pipe(
      switchMap((feasibilityQuery) =>
        this.criterionValidationManagerService.getMissingRequiredFilterCriteria(feasibilityQuery)
      )
    );
  }

  /**
   *
   * @returns Observable<string[]>
   */
  public getInvalidCriteria(): Observable<string[]> {
    return this.getActiveFeasibilityQuery().pipe(
      map((feasibilityQuery) =>
        this.criterionValidationManagerService.getInvalidCriteria(feasibilityQuery)
      )
    );
  }

  /**
   *
   * @returns Observable<boolean>
   */
  public getIsInclusionSet(): Observable<boolean> {
    return this.getActiveFeasibilityQuery().pipe(
      map((feasibilityQuery) =>
        this.criterionValidationManagerService.isInclusionSet(feasibilityQuery)
      )
    );
  }

  /**
   *
   * @returns Observable<boolean>
   */
  public getIsFeasibilityQuerySet(): Observable<boolean> {
    return this.getActiveFeasibilityQuery().pipe(
      map((feasibilityQuery) =>
        this.criterionValidationManagerService.isFeasibilityQuerySet(feasibilityQuery)
      )
    );
  }

  /**
   *
   * @returns Observable<boolean>
   */
  public getIsFeasibilityQueryValid(): Observable<boolean> {
    return combineLatest([
      this.getMissingRequiredFilterCriteria().pipe(
        map((missingCriteria) => missingCriteria.length === 0)
      ),
      this.getInvalidCriteria().pipe(map((invalidCriteria) => invalidCriteria.length === 0)),
      this.getIsInclusionSet(),
    ]).pipe(
      map(
        ([noMissingCriteria, noInvalidCriteria, isInclusionSet]) =>
          noMissingCriteria && noInvalidCriteria && isInclusionSet
      )
    );
  }

  /**
   *
   * @returns Observable<FeasibilityQuery>
   */
  private getActiveFeasibilityQuery(): Observable<FeasibilityQuery> {
    return this.feasibilityQueryProvider.getActiveFeasibilityQuery();
  }
}
