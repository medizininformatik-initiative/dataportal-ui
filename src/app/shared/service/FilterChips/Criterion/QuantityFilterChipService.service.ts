import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData';
import { FilterChipQuantityAdapter } from '../../../models/FilterChips/Adapter/FilterChipQuantityAdapter';
import { Injectable } from '@angular/core';
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter';

@Injectable({
  providedIn: 'root',
})
export class QuantityFilterChipService {
  constructor() {}

  /**
   * Generates quantity filter chips from an array of AttributeFilters.
   *
   * @param attributeFilters Array of AttributeFilter objects
   * @returns Array of FilterChipData
   */
  public generateQuantityChipsFromAttributeFilters(
    attributeFilters: AttributeFilter[]
  ): FilterChipData[] {
    const chips = attributeFilters.map((attributeFilter: AttributeFilter) =>
      this.createQuantityChips(attributeFilter)
    );

    return chips.filter((chip) => chip !== undefined);
  }

  /**
   * Generates quantity filter chips from an array of ValueFilters.
   *
   * @param valueFilters Array of ValueFilter objects
   * @returns Array of FilterChipData
   */
  public generateQuantityChipsFromValueFilters(valueFilters: ValueFilter[]): FilterChipData[] {
    const chips = valueFilters.map((valueFilter: ValueFilter) =>
      this.createQuantityChips(valueFilter)
    );

    return chips.filter((chip) => chip !== undefined);
  }

  /**
   * Generates quantity filter chips obtained from AttributeFilter.
   *
   * @param quantityFilter The AbstractQuantityFilter object
   * @returns Array of FilterChipData
   */
  private createQuantityChips(filter: AttributeFilter | ValueFilter): FilterChipData {
    const quantityFilter = filter?.getQuantity();
    const display: Display = filter.getDisplay();
    if (quantityFilter && quantityFilter.getComparator()) {
      return FilterChipQuantityAdapter.adaptQuantity(quantityFilter, display);
    }
  }
}
