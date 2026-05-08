import { AbstractCriterion } from 'src/app/model/FeasibilityQuery/Criterion/AbstractCriterion';
import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter';
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction';
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { BehaviorSubject, Observable } from 'rxjs';
import { CloneAbstractCriterion } from 'src/app/model/Utilities/CriterionCloner/CloneReferenceCriterion';
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service';
import { EditAttributeFilterService } from './Edit/EditAttributeFilter.service';
import { EditReferenceFilterService } from './Edit/EditReferenceFilter.service';
import { EditValueFilterService } from './Edit/EditValueFilter.service';
import { Injectable } from '@angular/core';
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter';

@Injectable({
  providedIn: 'root',
})
export class EditCriterionService {
  private criterionSubject: BehaviorSubject<Criterion>;

  criterion$: Observable<Criterion>;

  constructor(
    private criterionProvider: CriterionProviderService,
    private referenceFilterService: EditReferenceFilterService,
    private valueFilterService: EditValueFilterService,
    private attributeFilterService: EditAttributeFilterService
  ) {}

  public initialize(criterion: AbstractCriterion): void {
    const copy = CloneAbstractCriterion.deepCopyAbstractCriterion(criterion);
    copy.setId(criterion.getId());
    this.criterionSubject = new BehaviorSubject<Criterion>(copy);
    this.criterion$ = this.criterionSubject.asObservable();
  }

  public getCriterion(): Criterion {
    const value = this.criterionSubject?.getValue();
    if (!value) {
      throw new Error('EditCriterionService: Criterion not initialized. Call initialize() first.');
    }
    return value;
  }

  public updateValueFilter(valueFilter: ValueFilter): void {
    const criterion = this.getCriterion();
    const valueFilters = this.valueFilterService.buildFromValueFilter(criterion, valueFilter);
    criterion.setValueFilters(valueFilters);
    criterion.setIsRequiredFilterSet(this.attributeFilterService.isFilterRequired(criterion));
    this.emit();
  }

  public updateConceptAttributeFilter(
    concept: ConceptFilter,
    attributeFilter: AttributeFilter
  ): void {
    const criterion = this.getCriterion();
    const attributeFilters = this.attributeFilterService.buildFromConcept(
      criterion,
      concept,
      attributeFilter
    );
    criterion.setAttributeFilters(attributeFilters);
    criterion.setIsRequiredFilterSet(this.attributeFilterService.isFilterRequired(criterion));
    this.emit();
  }

  public updateQuantityAttributeFilter(
    quantityFilter: AbstractQuantityFilter,
    attributeFilter: AttributeFilter
  ): void {
    const criterion = this.getCriterion();
    const attributeFilters = this.attributeFilterService.buildFromQuantity(
      criterion,
      quantityFilter,
      attributeFilter
    );
    criterion.setAttributeFilters(attributeFilters);
    criterion.setIsRequiredFilterSet(this.attributeFilterService.isFilterRequired(criterion));
    this.emit();
  }

  public updateTimeRestriction(timeRestriction: AbstractTimeRestriction): void {
    const criterion = this.getCriterion();
    criterion.setTimeRestriction(timeRestriction);
    this.emit();
  }

  public updateTermCodes(termCodes: TerminologyCode[]): void {
    const criterion = this.getCriterion();
    criterion.setTermCodes(termCodes);
    this.emit();
  }

  public updateReferenceFilter(
    ids: string[],
    attributeFilter: AttributeFilter
  ): Observable<ReferenceCriterion[]> {
    return this.referenceFilterService.updateReferenceFilter(
      ids,
      this.getCriterion().getId(),
      attributeFilter
    );
  }

  private emit(): void {
    const criterion = this.getCriterion();
    const copy = CloneAbstractCriterion.deepCopyAbstractCriterion(criterion);
    copy.setId(criterion.getId());
    this.updateProvider(copy);
    this.criterionSubject.next(copy);
  }

  private updateProvider(criterion: Criterion): void {
    this.criterionProvider.setOne(criterion);
  }

  public updateConceptValueFilter(conceptFilter: ConceptFilter): void {
    const criterion = this.getCriterion();
    criterion.setValueFilters(this.valueFilterService.buildFromConcept(criterion, conceptFilter));
    this.emit();
  }

  public updateQuantityValueFilter(quantityFilter: AbstractQuantityFilter): void {
    const criterion = this.getCriterion();
    criterion.setValueFilters(this.valueFilterService.buildFromQuantity(criterion, quantityFilter));
    this.emit();
  }
}
