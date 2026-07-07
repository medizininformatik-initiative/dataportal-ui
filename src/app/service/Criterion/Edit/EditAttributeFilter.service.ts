import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { Injectable, inject } from '@angular/core'
import { ReferenceFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ReferenceFilter'
import { FeasibilityQueryValidationService } from '../../Validation/FeasibilityQueryValidationService.service'

@Injectable({
  providedIn: 'root',
})
export class EditAttributeFilterService {
  private feasibilityQueryValidationService = inject(FeasibilityQueryValidationService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Returns an updated attribute filter list with the provided concept applied
   * to the matching attribute filter entry.
   */
  public buildFromConcept(
    criterion: Criterion,
    conceptFilter: ConceptFilter,
    attributeFilter: AttributeFilter
  ): AttributeFilter[] {
    const filters = [...criterion.getAttributeFilters()]
    const updated = this.buildAttributeFilter(
      attributeFilter,
      FilterTypes.CONCEPT,
      conceptFilter,
      undefined
    )
    const index = filters.findIndex(
      (existing) =>
        attributeFilter.getAttributeCode()?.getCode() === existing.getAttributeCode()?.getCode()
    )
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
   */
  public buildFromReference(
    criterion: Criterion,
    referenceFilter: ReferenceFilter,
    attributeFilter: AttributeFilter
  ): AttributeFilter[] {
    const filters = [...criterion.getAttributeFilters()]
    const updated = this.buildAttributeFilter(
      attributeFilter,
      FilterTypes.REFERENCE,
      undefined,
      undefined,
      referenceFilter
    )
    const index = filters.findIndex(
      (existing) =>
        attributeFilter.getAttributeCode()?.getCode() === existing.getAttributeCode()?.getCode()
    )
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
   */
  public buildFromQuantity(
    criterion: Criterion,
    quantityFilter: AbstractQuantityFilter,
    attributeFilter: AttributeFilter
  ): AttributeFilter[] {
    const filters = [...criterion.getAttributeFilters()]
    const updated = this.buildAttributeFilter(
      attributeFilter,
      FilterTypes.QUANTITY,
      undefined,
      quantityFilter
    )
    const index = filters.findIndex(
      (existing) =>
        attributeFilter.getAttributeCode()?.getCode() === existing.getAttributeCode()?.getCode()
    )
    if (index !== -1) {
      filters[index] = updated
    } else {
      filters.push(updated)
    }
    return filters
  }

  public isFilterRequired(criterion: Criterion): boolean {
    return this.feasibilityQueryValidationService.isRequiredFilterSet(criterion)
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
