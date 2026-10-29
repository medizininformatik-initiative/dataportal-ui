import { inject, Injectable } from '@angular/core'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { ReferenceFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ReferenceFilter'
import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { CriterionValidationService } from '../../Validation/Internal/CriterionValidationService.service'

@Injectable({
  providedIn: 'root',
})
export class EditAttributeFilterService {
  private readonly criterionValidationService = inject(CriterionValidationService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Returns an updated attribute filter list with the provided concept applied
   * to the matching attribute filter entry.
   * @param {Criterion} criterion
   * @param {ConceptFilter} conceptFilter
   * @param {AttributeFilter} attributeFilter
   * @returns {AttributeFilter[]}
   */
  public buildFromConcept(criterion: Criterion, conceptFilter: ConceptFilter, attributeFilter: AttributeFilter): AttributeFilter[] {
    const filters = [...criterion.getAttributeFilters()]
    const updated = this.buildAttributeFilter(attributeFilter, FilterTypes.CONCEPT, conceptFilter, undefined)
    const index = filters.findIndex((existing) => attributeFilter.getAttributeCode()?.getCode() === existing.getAttributeCode()?.getCode())
    if (index !== -1) {
      filters[index] = updated
    } else {
      filters.push(updated)
    }
    return filters
  }

  /**
   * Returns an updated attribute filter list with the provided reference applied
   * to the matching attribute filter entry.
   * @param {Criterion} criterion
   * @param {ReferenceFilter} referenceFilter
   * @param {AttributeFilter} attributeFilter
   * @returns {AttributeFilter[]}
   */
  public buildFromReference(criterion: Criterion, referenceFilter: ReferenceFilter, attributeFilter: AttributeFilter): AttributeFilter[] {
    const filters = [...criterion.getAttributeFilters()]
    const updated = this.buildAttributeFilter(attributeFilter, FilterTypes.REFERENCE, undefined, undefined, referenceFilter)
    const index = filters.findIndex((existing) => attributeFilter.getAttributeCode()?.getCode() === existing.getAttributeCode()?.getCode())
    if (index !== -1) {
      filters[index] = updated
    } else {
      filters.push(updated)
    }
    return filters
  }

  /**
   * Returns an updated attribute filter list with the provided quantity applied
   * to the matching attribute filter entry.
   * @param {Criterion} criterion
   * @param {AbstractQuantityFilter} quantityFilter
   * @param {AttributeFilter} attributeFilter
   * @returns {AttributeFilter[]}
   */
  public buildFromQuantity(
    criterion: Criterion,
    quantityFilter: AbstractQuantityFilter,
    attributeFilter: AttributeFilter
  ): AttributeFilter[] {
    const filters = [...criterion.getAttributeFilters()]
    const updated = this.buildAttributeFilter(attributeFilter, FilterTypes.QUANTITY, undefined, quantityFilter)
    const index = filters.findIndex((existing) => attributeFilter.getAttributeCode()?.getCode() === existing.getAttributeCode()?.getCode())
    if (index !== -1) {
      filters[index] = updated
    } else {
      filters.push(updated)
    }
    return filters
  }

  public isFilterRequired(criterion: Criterion): boolean {
    return this.criterionValidationService.isRequiredFilterSet(criterion)
  }

  private buildAttributeFilter(
    attributeFilter: AttributeFilter,
    filterType: FilterTypes,
    conceptFilter?: ConceptFilter,
    quantityFilter?: AbstractQuantityFilter,
    referenceFilter?: ReferenceFilter
  ): AttributeFilter {
    return new AttributeFilter(
      attributeFilter.getDisplay(),
      filterType,
      attributeFilter.getAttributeCode(),
      conceptFilter,
      quantityFilter,
      referenceFilter,
      attributeFilter.getOptional()
    )
  }
}
