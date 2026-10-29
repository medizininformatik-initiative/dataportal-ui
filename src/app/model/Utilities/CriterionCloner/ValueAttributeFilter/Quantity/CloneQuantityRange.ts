import { QuantityRangeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { CloneQuantityUnit } from './CloneQuantityUnit'

export class CloneQuantityRange {
  /**
   * Creates a deep copy of a QuantityRangeFilter instance.
   *
   * @param {QuantityRangeFilter} quantityRangeFilter - The QuantityRangeFilter instance to deep copy.
   * @returns {QuantityRangeFilter} A new QuantityRangeFilter instance that is a deep copy of the given instance.
   */
  public static deepCopyQuantityRangeFilter(quantityRangeFilter: QuantityRangeFilter): QuantityRangeFilter {
    if (!(quantityRangeFilter instanceof QuantityRangeFilter)) {
      throw new Error('Invalid instance type for deep copy')
    }

    const copiedSelectedUnit = quantityRangeFilter.getSelectedUnit()
      ? CloneQuantityUnit.deepCopyQuantityUnit(quantityRangeFilter.getSelectedUnit())
      : undefined

    const copiedAllowedUnits = CloneQuantityUnit.deepCopyQuantityUnits(quantityRangeFilter.getAllowedUnits())

    return new QuantityRangeFilter(
      copiedSelectedUnit,
      copiedAllowedUnits,
      quantityRangeFilter.getPrecision(),
      quantityRangeFilter.getMinValue(),
      quantityRangeFilter.getMaxValue()
    )
  }
}
