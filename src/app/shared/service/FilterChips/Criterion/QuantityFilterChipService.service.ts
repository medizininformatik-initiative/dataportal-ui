import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { FilterChipQuantityAdapter } from '../../../models/FilterChips/Adapter/FilterChipQuantityAdapter';
import { Injectable } from '@angular/core';
import { InterfaceFilterChip } from '../../../models/FilterChips/InterfaceFilterChip';
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
   * @returns Array of InterfaceFilterChip
   */
  public generateQuantityChipsFromAttributeFilters(
    attributeFilters: AttributeFilter[]
  ): InterfaceFilterChip[] {
    const chips = attributeFilters.map((attributeFilter: AttributeFilter) =>
      this.createQuantityChips(attributeFilter)
    );

    return chips.filter((chip) => chip !== undefined);
  }

  /**
   * Generates quantity filter chips from an array of ValueFilters.
   *
   * @param valueFilters Array of ValueFilter objects
   * @returns Array of InterfaceFilterChip
   */
  public generateQuantityChipsFromValueFilters(valueFilters: ValueFilter[]): InterfaceFilterChip[] {
    const chips = valueFilters.map((valueFilter: ValueFilter) =>
      this.createQuantityChips(valueFilter)
    );

    return chips.filter((chip) => chip !== undefined);
  }

  /**
   * Generates quantity filter chips obtained from AttributeFilter.
   *
   * @param quantityFilter The AbstractQuantityFilter object
   * @returns Array of InterfaceFilterChip
   */
  private createQuantityChips(filter: AttributeFilter | ValueFilter): InterfaceFilterChip {
    const quantityFilter = filter?.getQuantity();
    const display: Display = filter.getDisplay();
    if (quantityFilter && quantityFilter.getComparator()) {
      return FilterChipQuantityAdapter.adaptQuantity(quantityFilter, display);
    }
  }
}
