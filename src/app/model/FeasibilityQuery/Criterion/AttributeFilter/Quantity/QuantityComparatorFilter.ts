import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { Comparator } from 'src/app/model/Utilities/Quantity/Comparator'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'
import { AbstractQuantityFilter } from './AbstractQuantityFilter'

/**
 * Class representing a QuantityComparatorFilter.
 */
export class QuantityComparatorFilter extends AbstractQuantityFilter {
  protected comparator: QuantityComparisonOption = QuantityComparisonOption.NONE
  private readonly type: FilterTypes = FilterTypes.QUANTITY_COMPARATOR
  private value: number | null = null

  /**
   * Creates an instance of QuantityComparatorFilter.
   *
   * @param {QuantityUnit} selectedUnit - The selected quantity unit (inherited from AbstractQuantityFilter).
   * @param {QuantityUnit[]} allowedUnits - The allowed quantity units (inherited from AbstractQuantityFilter).
   * @param {number} precision - The precision of the quantity filter (inherited from AbstractQuantityFilter).
   * @param {QuantityComparisonOption} comparator - The comparator type.
   * @param {number | null} value - The comparison value.
   */
  constructor(
    selectedUnit: QuantityUnit,
    allowedUnits: QuantityUnit[] = [],
    precision: number = 0,
    comparator: QuantityComparisonOption = QuantityComparisonOption.NONE,
    value: number | null = null
  ) {
    super(allowedUnits, selectedUnit, precision)
    this.comparator = comparator
    this.value = value
  }

  /**
   * Gets the comparator type.
   *
   * @returns {QuantityComparisonOption} The comparator type.
   */
  public getComparator(): QuantityComparisonOption {
    return this.comparator
  }

  /**
   * Sets the comparator type.
   *
   * @param {QuantityComparisonOption} comparator - The comparator type to set.
   */
  public setComparator(comparator: QuantityComparisonOption): void {
    this.comparator = comparator
  }

  /**
   * Gets the comparison value.
   *
   * @returns {number | null} The comparison value.
   */
  public getValue(): number | null {
    return this.value
  }

  /**
   * Sets the comparison value.
   *
   * @param {number | null} value - The comparison value to set.
   */
  public setValue(value: number | null): void {
    this.value = value
  }

  /**
   * Gets the filter type.
   *
   * @returns {FilterTypes} The filter type.
   */
  public getType(): FilterTypes {
    return this.type
  }

  public mapQuantityComparisonToComparator(option: QuantityComparisonOption): Comparator {
    switch (option) {
      case QuantityComparisonOption.NONE:
        return Comparator.NONE
      case QuantityComparisonOption.EQUAL:
        return Comparator.EQUAL
      case QuantityComparisonOption.LESS_THAN:
        return Comparator.LESS_THAN
      case QuantityComparisonOption.GREATER_THAN:
        return Comparator.GREATER_THAN
      case QuantityComparisonOption.BETWEEN:
        return Comparator.BETWEEN
      default:
        return Comparator.NONE
    }
  }
}
