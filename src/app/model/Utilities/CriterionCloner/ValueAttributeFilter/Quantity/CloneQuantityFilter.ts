import { QuantityNotSet } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityNotSet'
import { AbstractQuantityFilter } from '../../../../FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { QuantityComparatorFilter } from '../../../../FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityComparatorFilter'
import { QuantityRangeFilter } from '../../../../FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter'
import { FilterTypes } from '../../../FilterTypes'
import { CloneQuantityComparator } from './CloneQuantityComparator'
import { CloneQuantityRange } from './CloneQuantityRange'

export class CloneQuantityFilter {
  public static deepCopyQuantityFilters(abstractQuantity: AbstractQuantityFilter): AbstractQuantityFilter {
    const quantityFilterType = abstractQuantity.getType()
    switch (quantityFilterType) {
      case FilterTypes.QUANTITY_RANGE:
        return CloneQuantityRange.deepCopyQuantityRangeFilter(abstractQuantity as QuantityRangeFilter)
      case FilterTypes.QUANTITY_COMPARATOR:
        return CloneQuantityComparator.deepCopyQuantityComparatorFilter(abstractQuantity as QuantityComparatorFilter)
      case FilterTypes.QUANTITY_NOT_SET:
        return new QuantityNotSet(abstractQuantity.getAllowedUnits(), undefined, abstractQuantity.getPrecision())
      default:
        return undefined
    }
  }
}
