import { Injectable, inject } from '@angular/core'
import { QuantityComparatorFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityComparatorFilter'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'
import { QuantityNotSet } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityNotSet'
import { QuantityRangeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'

@Injectable({
  providedIn: 'root',
})
export class QuantityFilterBuilder {
  private precision: number
  private quantityUnit: QuantityUnit
  private allowedUnits: QuantityUnit[]

  constructor(allowedUnits: QuantityUnit[], precision: number, quantityUnit: QuantityUnit) {
    this.precision = precision
    this.allowedUnits = allowedUnits
    this.quantityUnit = quantityUnit
  }

  public buildQuantityComparatorFilter(
    value: number,
    comparator: QuantityComparisonOption
  ): QuantityComparatorFilter {
    return new QuantityComparatorFilter(
      this.quantityUnit,
      this.allowedUnits,
      this.precision,
      comparator,
      value
    )
  }

  public buildQuantityRangeFilter(minValue: number, maxValue: number): QuantityRangeFilter {
    return new QuantityRangeFilter(
      this.quantityUnit,
      this.allowedUnits,
      this.precision,
      minValue,
      maxValue
    )
  }

  public buildEmptyQuantityFilter(): QuantityNotSet {
    return new QuantityNotSet(this.allowedUnits, undefined, this.precision)
  }
}
