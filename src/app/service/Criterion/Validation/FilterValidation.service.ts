import { AbstractAttributeFilters } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AbstractAttributeFilters'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { FilterTypesService } from '../../FilterTypes.service'
import { Injectable, inject } from '@angular/core'
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter'

@Injectable({
  providedIn: 'root',
})
export class FilterValidationService {
  private filterTypeService = inject(FilterTypesService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public hasAllRequiredValueFilters(valueFilters: ValueFilter[]): boolean {
    return this.requiredFiltersAreSet(valueFilters)
  }

  public hasAllRequiredAttributeFilters(attributeFilters: AttributeFilter[]): boolean {
    return this.requiredFiltersAreSet(attributeFilters)
  }

  private requiredFiltersAreSet(filters: AbstractAttributeFilters[]): boolean {
    return filters.some((filter) => !filter.getOptional() || this.isFilterComplete(filter))
  }

  private isFilterComplete(filter: AbstractAttributeFilters): boolean {
    return this.hasSelectedConcepts(filter) || this.hasSetQuantity(filter)
  }

  private hasSelectedConcepts(filter: AbstractAttributeFilters): boolean {
    return filter.getConcept()?.getSelectedConcepts().length > 0
  }

  private hasSetQuantity(filter: AbstractAttributeFilters): boolean {
    return !this.filterTypeService.isQuantityNotSet(filter.getQuantity()?.getType())
  }
}
