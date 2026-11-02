import { Injectable } from '@angular/core'
import { QuantityComparatorFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityComparatorFilter'
import { QuantityNotSet } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityNotSet'
import { QuantityRangeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'

@Injectable({
  providedIn: 'root',
})
export class QuantityFilterFactoryService {
  private precision: number
  private quantityUnit: QuantityUnit
  private allowedUnits: QuantityUnit[]

  constructor() {}

  /**
   * Sets the precision for new filters.
   * @param {number} precision
   */
  public setPrecision(precision: number): void {
    this.precision = precision
  }

  /**
   * Sets the allowed units for new filters.
   * @param {QuantityUnit[]} units
   */
  public setAllowedUnits(units: QuantityUnit[]): void {
    this.allowedUnits = units
  }

  /**
   * Sets the unit for new filters.
   * @param {QuantityUnit} selectedUnit
   */
  public setQuantityUnit(selectedUnit: QuantityUnit) {
    this.quantityUnit = selectedUnit
  }

  /**
   * Creates a quantity filter with a comparator and a value.
   * @param {number} value
   * @param {QuantityComparisonOption} comparator
   * @returns {QuantityComparatorFilter}
   */
  public createQuantityComparatorFilter(value: number, comparator: QuantityComparisonOption): QuantityComparatorFilter {
    return new QuantityComparatorFilter(this.quantityUnit, this.allowedUnits, this.precision, comparator, value)
  }

  /**
   * Creates a quantity filter with a minimum and a maximum value.
   * @param {number} minValue
   * @param {number} maxValue
   * @returns {QuantityRangeFilter}
   */
  public createQuantityRangeFilter(minValue: number, maxValue: number): QuantityRangeFilter {
    return new QuantityRangeFilter(this.quantityUnit, this.allowedUnits, this.precision, minValue, maxValue)
  }

  /**
   * Creates a quantity filter without a value.
   * @returns {QuantityNotSet}
   */
  public createEmptyQuantityFilter(): QuantityNotSet {
    return new QuantityNotSet(this.allowedUnits)
  }
}
