import { QuantityComparatorFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityComparatorFilter'
import { QuantityNotSet } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityNotSet'
import { QuantityRangeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'

export class QuantityFilterBuilder {
  private readonly precision: number
  private readonly quantityUnit: QuantityUnit
  private readonly allowedUnits: QuantityUnit[]

  /**
   * Stores the unit settings used by every built filter.
   * @param {QuantityUnit[]} allowedUnits
   * @param {number} precision
   * @param {QuantityUnit} quantityUnit
   */
  constructor(allowedUnits: QuantityUnit[], precision: number, quantityUnit: QuantityUnit) {
    this.precision = precision
    this.allowedUnits = allowedUnits
    this.quantityUnit = quantityUnit
  }

  /**
   * Builds a comparator filter with the configured unit, allowed units and precision.
   * @param {number} value
   * @param {QuantityComparisonOption} comparator
   * @returns {QuantityComparatorFilter}
   */
  public buildQuantityComparatorFilter(value: number, comparator: QuantityComparisonOption): QuantityComparatorFilter {
    return new QuantityComparatorFilter(this.quantityUnit, this.allowedUnits, this.precision, comparator, value)
  }

  /**
   * Builds a range filter with the configured unit, allowed units and precision.
   * @param {number} minValue
   * @param {number} maxValue
   * @returns {QuantityRangeFilter}
   */
  public buildQuantityRangeFilter(minValue: number, maxValue: number): QuantityRangeFilter {
    return new QuantityRangeFilter(this.quantityUnit, this.allowedUnits, this.precision, minValue, maxValue)
  }

  /**
   * Builds a filter without a value.
   * @returns {QuantityNotSet}
   */
  public buildEmptyQuantityFilter(): QuantityNotSet {
    return new QuantityNotSet(this.allowedUnits, undefined, this.precision)
  }
}
