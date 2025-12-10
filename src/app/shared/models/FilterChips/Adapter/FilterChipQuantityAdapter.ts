import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { FilterChipBuilder } from '../FilterChipBuilder';
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes';
import { getArithmeticSymbol } from 'src/app/model/Utilities/Quantity/ArithmeticSymbolResolver';
import { InterfaceFilterChip } from '../InterfaceFilterChip';
import { QuantityComparatorFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityComparatorFilter';
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions';
import { QuantityRangeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter';
import { v4 as uuidv4 } from 'uuid';

export class FilterChipQuantityAdapter {
  public static adaptQuantity(
    quantity: AbstractQuantityFilter,
    display: Display
  ): InterfaceFilterChip {
    const type = quantity.getType();
    if (type !== FilterTypes.QUANTITY_NOT_SET) {
      const unitDisplay = quantity.getSelectedUnit().getDisplay();
      const comparator = quantity.getComparator();
      const symbol = getArithmeticSymbol(comparator);
      switch (comparator) {
        case QuantityComparisonOption.BETWEEN:
          return this.createQuantityRangeChip(display, quantity as QuantityRangeFilter, unitDisplay);
        case QuantityComparisonOption.EQUAL:
        case QuantityComparisonOption.GREATER_THAN:
        case QuantityComparisonOption.LESS_THAN:
          return this.createQuantityComparatorChip(
            display,
            quantity as QuantityComparatorFilter,
            unitDisplay,
            symbol
          );
        default:
          break;
      }
    }
  }

  private static createQuantityRangeChip(
    display: Display,
    quantity: QuantityRangeFilter,
    unitDisplay: string
  ): InterfaceFilterChip {
    const minValue = quantity.getMinValue();
    const maxValue = quantity.getMaxValue();
    const text = `${minValue} - ${maxValue} ${unitDisplay}`;

    return this.createFilterChip(display, text);
  }

  private static createQuantityComparatorChip(
    display: Display,
    quantity: QuantityComparatorFilter,
    unitDisplay: string,
    symbol
  ): InterfaceFilterChip {
    const value = quantity.getValue();
    const text = `${symbol} ${value} ${unitDisplay}`;

    return this.createFilterChip(display, text);
  }

  /**
   * Creates a filter chip with the given type and text.
   *
   * @param type The type of filter chip
   * @param text The text to display in the chip
   * @returns An InterfaceFilterChip
   */
  private static createFilterChip(display: Display, text: string): InterfaceFilterChip {
    const builder = new FilterChipBuilder(display);
    builder.addData(uuidv4(), text);
    return builder.buildFilterChip();
  }
}
