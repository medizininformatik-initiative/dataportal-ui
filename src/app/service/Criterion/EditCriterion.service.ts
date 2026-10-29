import { Injectable, inject } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { AbstractCriterion } from 'src/app/model/FeasibilityQuery/Criterion/AbstractCriterion'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { CloneAbstractCriterion } from 'src/app/model/Utilities/CriterionCloner/CloneReferenceCriterion'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { EditAttributeFilterService } from './Edit/EditAttributeFilter.service'
import { EditReferenceFilterService } from './Edit/EditReferenceFilter.service'
import { EditValueFilterService } from './Edit/EditValueFilter.service'

@Injectable({
  providedIn: 'root',
})
export class EditCriterionService {
  private readonly criterionProvider = inject(CriterionProviderService)
  private readonly referenceFilterService = inject(EditReferenceFilterService)
  private readonly valueFilterService = inject(EditValueFilterService)
  private readonly attributeFilterService = inject(EditAttributeFilterService)

  private criterionSubject: BehaviorSubject<Criterion>

  public criterion$: Observable<Criterion>

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Initializes the value.
   *
   * @param criterion
   */
  public initialize(criterion: AbstractCriterion): void {
    const copy = CloneAbstractCriterion.deepCopyAbstractCriterion(criterion)
    copy.setId(criterion.getId())
    this.criterionSubject = new BehaviorSubject<Criterion>(copy)
    this.criterion$ = this.criterionSubject.asObservable()
  }

  public getCriterion(): Criterion {
    const value = this.criterionSubject?.getValue()
    if (!value) {
      throw new Error('EditCriterionService: Criterion not initialized. Call initialize() first.')
    }
    return value
  }

  /**
   * Updates the value filter.
   *
   * @param valueFilter
   */
  public updateValueFilter(valueFilter: ValueFilter): void {
    const criterion = this.getCriterion()
    const valueFilters = this.valueFilterService.buildFromValueFilter(criterion, valueFilter)
    criterion.setValueFilters(valueFilters)
    criterion.setIsRequiredFilterSet(this.attributeFilterService.isFilterRequired(criterion))
    this.emit()
  }

  /**
   * Updates the concept attribute filter.
   *
   * @param concept
   * @param attributeFilter
   */
  public updateConceptAttributeFilter(concept: ConceptFilter, attributeFilter: AttributeFilter): void {
    const criterion = this.getCriterion()
    const attributeFilters = this.attributeFilterService.buildFromConcept(criterion, concept, attributeFilter)
    criterion.setAttributeFilters(attributeFilters)
    criterion.setIsRequiredFilterSet(this.attributeFilterService.isFilterRequired(criterion))
    this.emit()
  }

  /**
   * Updates the quantity attribute filter.
   *
   * @param quantityFilter
   * @param attributeFilter
   */
  public updateQuantityAttributeFilter(quantityFilter: AbstractQuantityFilter, attributeFilter: AttributeFilter): void {
    const criterion = this.getCriterion()
    const attributeFilters = this.attributeFilterService.buildFromQuantity(criterion, quantityFilter, attributeFilter)
    criterion.setAttributeFilters(attributeFilters)
    criterion.setIsRequiredFilterSet(this.attributeFilterService.isFilterRequired(criterion))
    this.emit()
  }

  /**
   * Updates the time restriction.
   *
   * @param timeRestriction
   */
  public updateTimeRestriction(timeRestriction: AbstractTimeRestriction): void {
    const criterion = this.getCriterion()
    criterion.setTimeRestriction(timeRestriction)
    this.emit()
  }

  /**
   * Updates the term codes.
   *
   * @param termCodes
   */
  public updateTermCodes(termCodes: TerminologyCode[]): void {
    const criterion = this.getCriterion()
    criterion.setTermCodes(termCodes)
    this.emit()
  }

  /**
   * Updates the reference filter.
   *
   * @param ids
   * @param attributeFilter
   */
  public updateReferenceFilter(ids: string[], attributeFilter: AttributeFilter): Observable<ReferenceCriterion[]> {
    return this.referenceFilterService.updateReferenceFilter(ids, this.getCriterion().getId(), attributeFilter)
  }

  private emit(): void {
    const criterion = this.getCriterion()
    const copy = CloneAbstractCriterion.deepCopyAbstractCriterion(criterion)
    copy.setId(criterion.getId())
    this.updateProvider(copy)
    this.criterionSubject.next(copy)
  }

  /**
   * Updates the provider.
   *
   * @param criterion
   */
  private updateProvider(criterion: Criterion): void {
    this.criterionProvider.setOne(criterion)
  }

  /**
   * Updates the concept value filter.
   *
   * @param conceptFilter
   */
  public updateConceptValueFilter(conceptFilter: ConceptFilter): void {
    const criterion = this.getCriterion()
    criterion.setValueFilters(this.valueFilterService.buildFromConcept(criterion, conceptFilter))
    this.emit()
  }

  /**
   * Updates the quantity value filter.
   *
   * @param quantityFilter
   */
  public updateQuantityValueFilter(quantityFilter: AbstractQuantityFilter): void {
    const criterion = this.getCriterion()
    criterion.setValueFilters(this.valueFilterService.buildFromQuantity(criterion, quantityFilter))
    this.emit()
  }
}
