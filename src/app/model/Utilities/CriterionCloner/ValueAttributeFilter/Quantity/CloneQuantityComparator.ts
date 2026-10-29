import { QuantityComparatorFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityComparatorFilter'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { CloneQuantityUnit } from './CloneQuantityUnit'

export class CloneQuantityComparator {
  /**
   * Creates a deep copy of a QuantityComparatorFilter instance.
   *
   * @param {QuantityComparatorFilter} quantityComparatorFilter - The QuantityComparatorFilter instance to deep copy.
   * @returns {QuantityComparatorFilter} A new QuantityComparatorFilter instance that is a deep copy of the given instance.
   */
  public static deepCopyQuantityComparatorFilter(quantityComparatorFilter: QuantityComparatorFilter): QuantityComparatorFilter {
    if (!(quantityComparatorFilter instanceof QuantityComparatorFilter)) {
      throw new Error('Invalid instance type for deep copy')
    }

    const copiedSelectedUnit = quantityComparatorFilter.getSelectedUnit()
      ? CloneQuantityUnit.deepCopyQuantityUnit(quantityComparatorFilter.getSelectedUnit())
      : undefined

    const copiedAllowedUnits = CloneQuantityUnit.deepCopyQuantityUnits(quantityComparatorFilter.getAllowedUnits())

    return new QuantityComparatorFilter(
      copiedSelectedUnit,
      copiedAllowedUnits,
      quantityComparatorFilter.getPrecision(),
      quantityComparatorFilter.getComparator(),
      quantityComparatorFilter.getValue()
    )
  }
}
