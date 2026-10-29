import { QuantityRangeFilterData } from 'src/app/model/Interface/Quantity/QuantityRangeFilterData'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'
import { QuantityUnit } from '../../../QuantityUnit'
import { AbstractQuantityFilter } from './AbstractQuantityFilter'

/**
 * Class representing a QuantityRangeFilter.
 */
export class QuantityRangeFilter extends AbstractQuantityFilter {
  protected comparator: QuantityComparisonOption = QuantityComparisonOption.BETWEEN
  private minValue: number | null = null
  private maxValue: number | null = null
  protected readonly type: FilterTypes = FilterTypes.QUANTITY_RANGE

  /**
   * Creates an instance of QuantityRangeFilter.
   *
   * @param {QuantityUnit} selectedUnit - The selected quantity unit (inherited from AbstractQuantityFilter).
   * @param {QuantityUnit[]} allowedUnits - The allowed quantity units (inherited from AbstractQuantityFilter).
   * @param {number} precision - The precision of the quantity filter (inherited from AbstractQuantityFilter).
   * @param {number | null} minValue - The minimum value of the quantity range.
   * @param {number | null} maxValue - The maximum value of the quantity range.
   */
  constructor(
    selectedUnit: QuantityUnit,
    allowedUnits: QuantityUnit[],
    precision: number = 0,
    minValue: number | null = null,
    maxValue: number | null = null
  ) {
    super(allowedUnits, selectedUnit, precision)
    this.minValue = minValue
    this.maxValue = maxValue
  }

  /**
   * Gets the minimum value of the quantity range.
   *
   * @returns {number | null} The minimum value.
   */
  public getMinValue(): number | null {
    return this.minValue
  }

  /**
   * Sets the minimum value of the quantity range.
   *
   * @param {number | null} minValue - The minimum value to set.
   */
  public setMinValue(minValue: number | null): void {
    this.minValue = minValue
  }

  /**
   * Gets the maximum value of the quantity range.
   *
   * @returns {number | null} The maximum value.
   */
  public getMaxValue(): number | null {
    return this.maxValue
  }

  /**
   * Sets the maximum value of the quantity range.
   *
   * @param {number | null} maxValue - The maximum value to set.
   */
  public setMaxValue(maxValue: number | null): void {
    this.maxValue = maxValue
  }

  /**
   * Gets the filter type.
   *
   * @returns {FilterTypes} The filter type.
   */
  public getType(): FilterTypes {
    return this.type
  }
}
