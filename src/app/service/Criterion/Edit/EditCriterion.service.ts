import { AbstractCriterion } from 'src/app/model/FeasibilityQuery/Criterion/AbstractCriterion'
import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { CloneAbstractCriterion } from 'src/app/model/Utilities/CriterionCloner/CloneReferenceCriterion'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { EditAttributeFilterService } from './EditAttributeFilter.service'
import { EditReferenceFilterService } from './EditReferenceFilter.service'
import { EditValueFilterService } from './EditValueFilter.service'
import { FeasibilityQueryValidationService } from '../../Validation/FeasibilityQueryValidationService.service'
import { inject, Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { ReferenceFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ReferenceFilter'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'

@Injectable({
  providedIn: 'root',
})
export class EditCriterionService {
  private criterionProvider = inject(CriterionProviderService)
  private referenceFilterService = inject(EditReferenceFilterService)
  private valueFilterService = inject(EditValueFilterService)
  private attributeFilterService = inject(EditAttributeFilterService)
  private feasibilityQueryValidationService = inject(FeasibilityQueryValidationService)

  private workingCriterion: Criterion

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public initialize(criterion: AbstractCriterion): void {
    const copy = CloneAbstractCriterion.deepCopyAbstractCriterion(criterion, true)
    copy.setId(criterion.getId())
    this.workingCriterion = copy as Criterion
  }

  public getCriterion(): Criterion {
    if (!this.workingCriterion) {
      throw new Error('EditCriterionService: Criterion not initialized. Call initialize() first.')
    }
    return this.workingCriterion
  }

  public updateConceptAttributeFilter(
    concept: ConceptFilter,
    attributeFilter: AttributeFilter
  ): void {
    const criterion = this.getCriterion()
    this.applyAttributeFilters(
      criterion,
      this.attributeFilterService.buildFromConcept(criterion, concept, attributeFilter)
    )
    this.emit()
  }

  public updateQuantityAttributeFilter(
    quantityFilter: AbstractQuantityFilter,
    attributeFilter: AttributeFilter
  ): void {
    const criterion = this.getCriterion()
    this.applyAttributeFilters(
      criterion,
      this.attributeFilterService.buildFromQuantity(criterion, quantityFilter, attributeFilter)
    )
    this.emit()
  }

  public updateTimeRestriction(timeRestriction: AbstractTimeRestriction): void {
    const criterion = this.getCriterion()
    criterion.setTimeRestriction(timeRestriction)
    this.emit()
  }

  public updateTermCodes(termCodes: TerminologyCode[]): void {
    const criterion = this.getCriterion()
    criterion.setTermCodes(termCodes)
    this.emit()
  }

  public addReferenceCriteria(
    id: string,
    attributeFilter: AttributeFilter
  ): Observable<ReferenceFilter> {
    return this.referenceFilterService
      .updateReferenceFilter([id], this.getCriterion().getId(), attributeFilter)
      .pipe(
        tap((updatedReferenceFilter) =>
          this.applyReferenceFilter(attributeFilter, updatedReferenceFilter)
        ),
        tap(() => this.emit())
      )
  }

  public updateSelectedReferences(
    attributeFilter: AttributeFilter,
    updatedReferences: ReferenceCriterion[]
  ): void {
    const updatedReferenceFilter = this.referenceFilterService.updateSelectedReferences(
      updatedReferences,
      attributeFilter
    )
    this.applyReferenceFilter(attributeFilter, updatedReferenceFilter)
    this.emit()
  }

  public updateConceptValueFilter(conceptFilter: ConceptFilter): void {
    const criterion = this.getCriterion()
    criterion.setValueFilters(this.valueFilterService.buildFromConcept(criterion, conceptFilter))
    this.emit()
  }

  public updateQuantityValueFilter(quantityFilter: AbstractQuantityFilter): void {
    const criterion = this.getCriterion()
    criterion.setValueFilters(this.valueFilterService.buildFromQuantity(criterion, quantityFilter))
    this.emit()
  }

  private applyAttributeFilters(criterion: Criterion, attributeFilters: AttributeFilter[]): void {
    criterion.setAttributeFilters(attributeFilters)
    criterion.setIsRequiredFilterSet(this.attributeFilterService.isFilterRequired(criterion))
  }

  private applyReferenceFilter(
    attributeFilter: AttributeFilter,
    referenceFilter: ReferenceFilter
  ): void {
    const criterion = this.getCriterion()
    this.applyAttributeFilters(
      criterion,
      this.attributeFilterService.buildFromReference(criterion, referenceFilter, attributeFilter)
    )
  }

  private emit(): void {
    const copy = CloneAbstractCriterion.deepCopyAbstractCriterion(this.workingCriterion, true)
    copy.setId(this.workingCriterion.getId())
    this.workingCriterion = copy as Criterion
    this.criterionProvider.setOne(this.workingCriterion)
  }
}
