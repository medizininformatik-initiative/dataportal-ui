import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter';
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { CriterionValidationService } from '../Validation/CriterionValidation.deprecated.service';
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EditAttributeFilterService {
  constructor(private criterionValidationService: CriterionValidationService) {}

  /**
   * Returns an updated attribute filter list with the provided concept applied
   * to the matching attribute filter entry.
   */
  public buildFromConcept(
    criterion: Criterion,
    conceptFilter: ConceptFilter,
    attributeFilter: AttributeFilter
  ): AttributeFilter[] {
    const filters = [...criterion.getAttributeFilters()];
    const updated = this.buildAttributeFilter(
      attributeFilter,
      FilterTypes.CONCEPT,
      conceptFilter,
      undefined
    );
    const index = filters.findIndex(
      (existing) =>
        attributeFilter.getAttributeCode()?.getCode() === existing.getAttributeCode()?.getCode()
    );
    if (index !== -1) {
      filters[index] = updated;
    } else {
      filters.push(updated);
    }
    return filters;
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
    const filters = [...criterion.getAttributeFilters()];
    const updated = this.buildAttributeFilter(
      attributeFilter,
      FilterTypes.QUANTITY,
      undefined,
      quantityFilter
    );
    const index = filters.findIndex(
      (existing) =>
        attributeFilter.getAttributeCode()?.getCode() === existing.getAttributeCode()?.getCode()
    );
    if (index !== -1) {
      filters[index] = updated;
    } else {
      filters.push(updated);
    }
    return filters;
  }

  public isFilterRequired(criterion: Criterion): boolean {
    return this.criterionValidationService.setIsFilterRequired(criterion);
  }

  private buildAttributeFilter(
    attributeFilter: AttributeFilter,
    filterType: FilterTypes,
    conceptFilter?: ConceptFilter,
    quantityFilter?: AbstractQuantityFilter
  ): AttributeFilter {
    return new AttributeFilter(
      attributeFilter.getDisplay(),
      filterType,
      attributeFilter.getAttributeCode(),
      conceptFilter,
      quantityFilter,
      undefined,
      attributeFilter.getOptional()
    );
  }
}
