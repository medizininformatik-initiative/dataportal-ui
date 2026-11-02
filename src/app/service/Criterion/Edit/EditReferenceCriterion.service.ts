import { Injectable, inject } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { ReferenceFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ReferenceFilter'
import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { CloneAbstractCriterion } from 'src/app/model/Utilities/CriterionCloner/CloneReferenceCriterion'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service'
import { EditAttributeFilterService } from './EditAttributeFilter.service'
import { EditReferenceFilterService } from './EditReferenceFilter.service'
import { EditValueFilterService } from './EditValueFilter.service'

@Injectable({
  providedIn: 'root',
})
export class EditReferenceCriterionService {
  private readonly referenceCriterionProvider = inject(ReferenceCriterionProviderService)
  private readonly criterionProvider = inject(CriterionProviderService)
  private readonly referenceFilterService = inject(EditReferenceFilterService)
  private readonly valueFilterService = inject(EditValueFilterService)
  private readonly attributeFilterService = inject(EditAttributeFilterService)

  private workingReferenceCriterion: ReferenceCriterion

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Starts editing a copy of the reference criterion.
   * @param {ReferenceCriterion} referenceCriterion
   */
  public initialize(referenceCriterion: ReferenceCriterion): void {
    const copy = CloneAbstractCriterion.deepCopyAbstractCriterion(referenceCriterion, true) as ReferenceCriterion
    copy.setId(referenceCriterion.getId())
    copy.setParentId(referenceCriterion.getParentId())
    this.workingReferenceCriterion = copy
  }

  /**
   * Returns the reference criterion being edited.
   * @returns {ReferenceCriterion}
   */
  public getReferenceCriterion(): ReferenceCriterion {
    if (!this.workingReferenceCriterion) {
      throw new Error('EditReferenceCriterionService: ReferenceCriterion not initialized. Call initialize() first.')
    }
    return this.workingReferenceCriterion
  }

  /**
   * Updates the concept filter of an attribute filter.
   * @param {ConceptFilter} concept
   * @param {AttributeFilter} attributeFilter
   */
  public updateConceptAttributeFilter(concept: ConceptFilter, attributeFilter: AttributeFilter): void {
    const criterion = this.getReferenceCriterion()
    this.applyAttributeFilters(criterion, this.attributeFilterService.buildFromConcept(criterion, concept, attributeFilter))
    this.emit()
  }

  /**
   * Updates the quantity filter of an attribute filter.
   * @param {AbstractQuantityFilter} quantityFilter
   * @param {AttributeFilter} attributeFilter
   */
  public updateQuantityAttributeFilter(quantityFilter: AbstractQuantityFilter, attributeFilter: AttributeFilter): void {
    const criterion = this.getReferenceCriterion()
    this.applyAttributeFilters(criterion, this.attributeFilterService.buildFromQuantity(criterion, quantityFilter, attributeFilter))
    this.emit()
  }

  /**
   * Updates the time restriction.
   * @param {AbstractTimeRestriction} timeRestriction
   */
  public updateTimeRestriction(timeRestriction: AbstractTimeRestriction): void {
    const criterion = this.getReferenceCriterion()
    criterion.setTimeRestriction(timeRestriction)
    this.emit()
  }

  /**
   * Updates the term codes.
   * @param {TerminologyCode[]} termCodes
   */
  public updateTermCodes(termCodes: TerminologyCode[]): void {
    const criterion = this.getReferenceCriterion()
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
    return this.referenceFilterService.updateReferenceFilter([id], this.getReferenceCriterion().getId(), attributeFilter).pipe(
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
    const criterion = this.getReferenceCriterion()
    criterion.setValueFilters(this.valueFilterService.buildFromConcept(criterion, conceptFilter))
    this.emit()
  }

  /**
   * Updates the quantity value filter.
   * @param {AbstractQuantityFilter} quantityFilter
   */
  public updateQuantityValueFilter(quantityFilter: AbstractQuantityFilter): void {
    const criterion = this.getReferenceCriterion()
    criterion.setValueFilters(this.valueFilterService.buildFromQuantity(criterion, quantityFilter))
    this.emit()
  }

  /**
   * Sets the attribute filters and updates the required flag.
   * @param {ReferenceCriterion} criterion
   * @param {AttributeFilter[]} attributeFilters
   */
  private applyAttributeFilters(criterion: ReferenceCriterion, attributeFilters: AttributeFilter[]): void {
    criterion.setAttributeFilters(attributeFilters)
    criterion.setIsRequiredFilterSet(this.attributeFilterService.isFilterRequired(criterion))
  }

  /**
   * Sets the reference filter on the attribute filter.
   * @param {AttributeFilter} attributeFilter
   * @param {ReferenceFilter} referenceFilter
   */
  private applyReferenceFilter(attributeFilter: AttributeFilter, referenceFilter: ReferenceFilter): void {
    const criterion = this.getReferenceCriterion()
    this.applyAttributeFilters(criterion, this.attributeFilterService.buildFromReference(criterion, referenceFilter, attributeFilter))
  }

  /**
   * Publishes a copy of the edited reference criterion.
   */
  private emit(): void {
    const copy = CloneAbstractCriterion.deepCopyAbstractCriterion(this.workingReferenceCriterion, true) as ReferenceCriterion
    copy.setId(this.workingReferenceCriterion.getId())
    copy.setParentId(this.workingReferenceCriterion.getParentId())
    this.workingReferenceCriterion = copy
    this.referenceCriterionProvider.setOne(this.workingReferenceCriterion)
    this.updateParentCriterion()
  }

  /**
   * Writes the edited reference criterion back into its parent criterion.
   */
  private updateParentCriterion(): void {
    const parentId = this.workingReferenceCriterion.getParentId()
    if (!parentId) {
      return
    }
    try {
      const parentCriterion = this.criterionProvider.getOne(parentId)
      this.criterionProvider.setOne(parentCriterion)
    } catch {
      // parent criterion not found in provider, nothing to update
    }
  }
}
