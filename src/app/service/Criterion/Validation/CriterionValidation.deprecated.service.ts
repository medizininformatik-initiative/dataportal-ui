import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionProviderService } from '../../Provider/CriterionProvider.service'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { FilterTypesService } from '../../FilterTypes.service'
import { Injectable, inject } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class CriterionValidationService {
  private criterionService = inject(CriterionProviderService)
  private filterTypeService = inject(FilterTypesService)

  private foundMissingFilterCriteria: BehaviorSubject<string[]> = new BehaviorSubject([])
  private foundInvalidCriteria: BehaviorSubject<string[]> = new BehaviorSubject([])
  private isInclusionSet: BehaviorSubject<boolean> = new BehaviorSubject(false)
  private isFeasibilityQuerySet: BehaviorSubject<boolean> = new BehaviorSubject(false)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {}

  public setIsFilterRequired(criterion: Criterion): boolean {
    return !(
      criterion.getValueFilters().filter(
        (valueFilter) =>
          !valueFilter.getOptional() &&
          (valueFilter.getConcept()?.getSelectedConcepts().length <= 0 ||
            //(this.filterTypeService.isQuantityComparator(valueFilter.getFilterType()) && (valueFilter.getQuantity() as QuantityComparatorFilter)?.getValue()) ||
            //(this.filterTypeService.isQuantityRange(valueFilter.getFilterType()) && (valueFilter.getQuantity() as QuantityRangeFilter)?.getMinValue()) ||
            this.filterTypeService.isQuantityNotSet(valueFilter.getQuantity()?.getType()))
      ).length > 0 ||
      criterion.getAttributeFilters().filter(
        (attributeFilter) =>
          !attributeFilter.getOptional() &&
          (attributeFilter.getConcept()?.getSelectedConcepts().length <= 0 ||
            //(this.filterTypeService.isQuantityComparator(attributeFilter.getFilterType()) && (attributeFilter.getQuantity() as QuantityComparatorFilter)?.getValue()) ||
            //(this.filterTypeService.isQuantityRange(attributeFilter.getFilterType()) && (attributeFilter.getQuantity() as QuantityRangeFilter)?.getMinValue())
            this.filterTypeService.isQuantityNotSet(attributeFilter.getQuantity()?.getType()))
      ).length > 0
    )
  }

  public checkCriteria(feasibilityQuery: FeasibilityQuery): void {
    const foundMissingFilterCriteria: string[] = []
    const foundInvalidCriteria: string[] = []

    //const feasibilityQuery = this.feasibilityQueryMap.get(this.activeFeasibilityQuery.getActiveFeasibilityQueryID())
    feasibilityQuery.getInclusionCriteria().forEach((innerArray) => {
      foundMissingFilterCriteria.push(
        ...innerArray.filter(
          (criterion) => this.criterionService.getOne(criterion).getIsRequiredFilterSet() === false
        )
      )
      this.foundMissingFilterCriteria.next(foundMissingFilterCriteria)
      foundInvalidCriteria.push(
        ...innerArray.filter(
          (criterion) => this.criterionService.getOne(criterion).getIsInvalid() === true
        )
      )

      this.foundInvalidCriteria.next(foundInvalidCriteria)
    })
    feasibilityQuery.getExclusionCriteria().forEach((innerArray) => {
      foundMissingFilterCriteria.push(
        ...innerArray.filter(
          (criterion) => this.criterionService.getOne(criterion).getIsRequiredFilterSet() === false
        )
      )
      this.foundMissingFilterCriteria.next(foundMissingFilterCriteria)
      foundInvalidCriteria.push(
        ...innerArray.filter(
          (criterion) => this.criterionService.getOne(criterion).getIsInvalid() === true
        )
      )
      this.foundInvalidCriteria.next(foundInvalidCriteria)
    })
    this.isInclusionSet.next(feasibilityQuery.getInclusionCriteria().length > 0)
    this.isFeasibilityQuerySet.next(
      feasibilityQuery.getInclusionCriteria().length > 0 ||
        feasibilityQuery.getExclusionCriteria().length > 0
    )
  }
  public getMissingRequiredFilterCriteria(): Observable<string[]> {
    return this.foundMissingFilterCriteria.asObservable()
  }
  public getInvalidCriteria(): Observable<string[]> {
    return this.foundInvalidCriteria.asObservable()
  }
  public getIsInclusionSet(): Observable<boolean> {
    return this.isInclusionSet.asObservable()
  }
  public getIsFeasibilityQuerySet(): Observable<boolean> {
    return this.isFeasibilityQuerySet.asObservable()
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
    )
  }
}
