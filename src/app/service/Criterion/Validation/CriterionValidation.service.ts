import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Criterion } from '../../../model/FeasibilityQuery/Criterion/Criterion';
import { CriterionProviderService } from '../../Provider/CriterionProvider.service';
import { FeasibilityQuery } from '../../../model/FeasibilityQuery/FeasibilityQuery';
import { FilterValidationService } from './FilterValidation.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CriterionValidationService {
  private foundMissingFilterCriteria = new BehaviorSubject<string[]>([]);
  private foundInvalidCriteria = new BehaviorSubject<string[]>([]);
  private isInclusionSet: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isFeasibilityQuerySet: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private criterionService: CriterionProviderService,
    private filterValidationService: FilterValidationService
  ) {}

  public isFilterRequired(criterion: Criterion): boolean {
    return (
      this.filterValidationService.hasAllRequiredValueFilters(criterion.getValueFilters()) &&
      this.filterValidationService.hasAllRequiredAttributeFilters(criterion.getAttributeFilters())
    );
  }

  /**
   * Processes the feasibility query criteria by examining both inclusion and exclusion groups.
   * It collects IDs for criteria that are missing required filters or are invalid.
   */
  public checkCriteria(feasibilityQuery: FeasibilityQuery): void {
    const missingCriteria: string[] = [];
    const invalidCriteria: string[] = [];

    const inclusionCriteria = feasibilityQuery.getInclusionCriteria();
    const exclusionCriteria = feasibilityQuery.getExclusionCriteria();

    inclusionCriteria.forEach((criteriaGroup) =>
      this.processCriteriaGroup(criteriaGroup, missingCriteria, invalidCriteria)
    );
    exclusionCriteria.forEach((criteriaGroup) =>
      this.processCriteriaGroup(criteriaGroup, missingCriteria, invalidCriteria)
    );

    this.foundMissingFilterCriteria.next(missingCriteria);
    this.foundInvalidCriteria.next(invalidCriteria);

    this.isInclusionSet.next(inclusionCriteria.length > 0);
    this.isFeasibilityQuerySet.next(inclusionCriteria.length > 0 || exclusionCriteria.length > 0);
  }

  /**
   * Processes a single criteria group (an array of criterion IDs) and pushes IDs into the
   * provided arrays if they are missing required filters or are invalid.
   */
  private processCriteriaGroup(
    criteriaGroup: string[],
    missingCriteria: string[],
    invalidCriteria: string[]
  ): void {
    criteriaGroup.forEach((criterionId) => {
      const criterion = this.criterionService.getCriterionByUID(criterionId);
      if (!criterion.getIsRequiredFilterSet()) {
        missingCriteria.push(criterionId);
      }
      if (criterion.getIsInvalid()) {
        invalidCriteria.push(criterionId);
      }
    });
  }

  public getMissingRequiredFilterCriteria(): Observable<string[]> {
    return this.foundMissingFilterCriteria.asObservable();
  }
  public getInvalidCriteria(): Observable<string[]> {
    return this.foundInvalidCriteria.asObservable();
  }
  public getIsInclusionSet(): Observable<boolean> {
    return this.isInclusionSet.asObservable();
  }
  public getIsFeasibilityQuerySet(): Observable<boolean> {
    return this.isFeasibilityQuerySet.asObservable();
  }

  public getIsFeasibilityQueryValid(): Observable<boolean> {
    return combineLatest([
      this.getMissingRequiredFilterCriteria().pipe(map((criteria) => criteria.length === 0)),
      this.getInvalidCriteria().pipe(map((criteria) => criteria.length === 0)),
      this.getIsInclusionSet(),
    ]).pipe(
      map(
        ([noMissingCriteria, noInvalidCriteria, isInclusionSet]) =>
          noMissingCriteria && noInvalidCriteria && isInclusionSet
      )
    );
  }
}
