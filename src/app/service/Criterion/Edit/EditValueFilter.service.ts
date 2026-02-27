import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter';
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes';
import { Injectable } from '@angular/core';
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter';

@Injectable({
  providedIn: 'root',
})
export class EditValueFilterService {
  /**
   * Replaces the value filter on a criterion with the provided one.
   */
  public buildFromValueFilter(criterion: Criterion, valueFilter: ValueFilter): ValueFilter[] {
    if (!(valueFilter instanceof ValueFilter)) {
      throw new Error('Provided filter is not a ValueFilter: ' + JSON.stringify(valueFilter));
    }
    return [valueFilter];
  }

  /**
   * Replaces the concept portion of the existing value filter.
   */
  public buildFromConcept(criterion: Criterion, conceptFilter: ConceptFilter): ValueFilter[] {
    const existing = this.getFirstValueFilter(criterion);
    const valueFilter = this.buildValueFilter(
      existing,
      FilterTypes.CONCEPT,
      conceptFilter,
      undefined
    );
    return [valueFilter];
  }

  /**
   * Replaces the quantity portion of the existing value filter.
   */
  public buildFromQuantity(
    criterion: Criterion,
    quantityFilter: AbstractQuantityFilter
  ): ValueFilter[] {
    const existing = this.getFirstValueFilter(criterion);
    const valueFilter = this.buildValueFilter(
      existing,
      FilterTypes.QUANTITY,
      undefined,
      quantityFilter
    );
    return [valueFilter];
  }

  private buildValueFilter(
    existing: ValueFilter,
    type: FilterTypes,
    conceptFilter?: ConceptFilter,
    quantityFilter?: AbstractQuantityFilter
  ): ValueFilter {
    if (type === FilterTypes.CONCEPT && !conceptFilter) {
      throw new Error('Concept filter must be provided for CONCEPT type.');
    }
    if (type === FilterTypes.QUANTITY && !quantityFilter) {
      throw new Error('Quantity filter must be provided for QUANTITY type.');
    }
    return new ValueFilter(
      existing.getDisplay(),
      type,
      conceptFilter ?? existing.getConcept(),
      quantityFilter ?? existing.getQuantity(),
      existing.getOptional()
    );
  }

  private getFirstValueFilter(criterion: Criterion): ValueFilter {
    const filters = criterion.getValueFilters();
    if (!filters?.length) {
      throw new Error('No value filters found on criterion.');
    }
    return filters[0];
  }
}
