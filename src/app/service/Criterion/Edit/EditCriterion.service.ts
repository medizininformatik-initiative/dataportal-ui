import { inject, Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { AbstractCriterion } from 'src/app/model/FeasibilityQuery/Criterion/AbstractCriterion'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { ReferenceFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ReferenceFilter'
import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { CloneAbstractCriterion } from 'src/app/model/Utilities/CriterionCloner/CloneReferenceCriterion'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { FeasibilityQueryValidationService } from '../../Validation/Internal/FeasibilityQueryValidationService.service'
import { EditAttributeFilterService } from './EditAttributeFilter.service'
import { EditReferenceFilterService } from './EditReferenceFilter.service'
import { EditValueFilterService } from './EditValueFilter.service'

@Injectable({
  providedIn: 'root',
})
export class EditCriterionService {
  private readonly criterionProvider = inject(CriterionProviderService)
  private readonly referenceFilterService = inject(EditReferenceFilterService)
  private readonly valueFilterService = inject(EditValueFilterService)
  private readonly attributeFilterService = inject(EditAttributeFilterService)
  private readonly feasibilityQueryValidationService = inject(FeasibilityQueryValidationService)

  private workingCriterion: Criterion

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Starts editing a copy of the criterion.
   * @param {AbstractCriterion} criterion
   */
  public initialize(criterion: AbstractCriterion): void {
    const copy = CloneAbstractCriterion.deepCopyAbstractCriterion(criterion, true)
    copy.setId(criterion.getId())
    this.workingCriterion = copy as Criterion
  }

  /**
   * Returns the criterion being edited.
   * @returns {Criterion}
   */
  public getCriterion(): Criterion {
    if (!this.workingCriterion) {
      throw new Error('EditCriterionService: Criterion not initialized. Call initialize() first.')
    }
    return this.workingCriterion
  }

  /**
   * Updates the concept filter of an attribute filter.
   * @param {ConceptFilter} concept
   * @param {AttributeFilter} attributeFilter
   */
  public updateConceptAttributeFilter(concept: ConceptFilter, attributeFilter: AttributeFilter): void {
    const criterion = this.getCriterion()
    this.applyAttributeFilters(criterion, this.attributeFilterService.buildFromConcept(criterion, concept, attributeFilter))
    this.emit()
  }

  /**
   * Updates the quantity filter of an attribute filter.
   * @param {AbstractQuantityFilter} quantityFilter
   * @param {AttributeFilter} attributeFilter
   */
  public updateQuantityAttributeFilter(quantityFilter: AbstractQuantityFilter, attributeFilter: AttributeFilter): void {
    const criterion = this.getCriterion()
    this.applyAttributeFilters(criterion, this.attributeFilterService.buildFromQuantity(criterion, quantityFilter, attributeFilter))
    this.emit()
  }

  /**
   * Updates the time restriction.
   * @param {AbstractTimeRestriction} timeRestriction
   */
  public updateTimeRestriction(timeRestriction: AbstractTimeRestriction): void {
    const criterion = this.getCriterion()
    criterion.setTimeRestriction(timeRestriction)
    this.emit()
  }

  /**
   * Updates the term codes.
   * @param {TerminologyCode[]} termCodes
   */
  public updateTermCodes(termCodes: TerminologyCode[]): void {
    const criterion = this.getCriterion()
    criterion.setTermCodes(termCodes)
    this.emit()
  }

  /**
   * Adds a reference criterion to the attribute filter.
   * @param {string} id
   * @param {AttributeFilter} attributeFilter
   * @returns {Observable<ReferenceFilter>}
   */
  public addReferenceCriteria(id: string, attributeFilter: AttributeFilter): Observable<ReferenceFilter> {
    return this.referenceFilterService.updateReferenceFilter([id], this.getCriterion().getId(), attributeFilter).pipe(
      tap((updatedReferenceFilter: ReferenceFilter) => this.applyReferenceFilter(attributeFilter, updatedReferenceFilter)),
      tap(() => this.emit())
    )
  }

  /**
   * Replaces the selected references of the attribute filter.
   * @param {AttributeFilter} attributeFilter
   * @param {ReferenceCriterion[]} updatedReferences
   */
  public updateSelectedReferences(attributeFilter: AttributeFilter, updatedReferences: ReferenceCriterion[]): void {
    const updatedReferenceFilter = this.referenceFilterService.updateSelectedReferences(updatedReferences, attributeFilter)
    this.applyReferenceFilter(attributeFilter, updatedReferenceFilter)
    this.emit()
  }

  /**
   * Updates the concept value filter.
   * @param {ConceptFilter} conceptFilter
   */
  public updateConceptValueFilter(conceptFilter: ConceptFilter): void {
    const criterion = this.getCriterion()
    criterion.setValueFilters(this.valueFilterService.buildFromConcept(criterion, conceptFilter))
    this.emit()
  }

  /**
   * Updates the quantity value filter.
   * @param {AbstractQuantityFilter} quantityFilter
   */
  public updateQuantityValueFilter(quantityFilter: AbstractQuantityFilter): void {
    const criterion = this.getCriterion()
    criterion.setValueFilters(this.valueFilterService.buildFromQuantity(criterion, quantityFilter))
    this.emit()
  }

  /**
   * Sets the attribute filters and updates the required flag.
   * @param {Criterion} criterion
   * @param {AttributeFilter[]} attributeFilters
   */
  private applyAttributeFilters(criterion: Criterion, attributeFilters: AttributeFilter[]): void {
    criterion.setAttributeFilters(attributeFilters)
    criterion.setIsRequiredFilterSet(this.attributeFilterService.isFilterRequired(criterion))
  }

  /**
   * Sets the reference filter on the attribute filter.
   * @param {AttributeFilter} attributeFilter
   * @param {ReferenceFilter} referenceFilter
   */
  private applyReferenceFilter(attributeFilter: AttributeFilter, referenceFilter: ReferenceFilter): void {
    const criterion = this.getCriterion()
    this.applyAttributeFilters(criterion, this.attributeFilterService.buildFromReference(criterion, referenceFilter, attributeFilter))
  }

  /**
   * Publishes a copy of the edited criterion.
   */
  private emit(): void {
    const copy = CloneAbstractCriterion.deepCopyAbstractCriterion(this.workingCriterion, true)
    copy.setId(this.workingCriterion.getId())
    this.workingCriterion = copy as Criterion
    this.criterionProvider.setOne(this.workingCriterion)
  }
}
