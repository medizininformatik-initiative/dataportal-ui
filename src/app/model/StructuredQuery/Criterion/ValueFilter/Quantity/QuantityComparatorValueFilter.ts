import { QuantityUnit } from 'src/app/model/StructuredQuery/QuantityUnit'
import { Comparator } from 'src/app/model/Utilities/Quantity/Comparator'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'
import { AbstractQuantityComparatorFilter } from '../../Abstract/Quantity/Comparator/AbstractQuantityComparatorFilter'

export class QuantityComparatorValueFilter extends AbstractQuantityComparatorFilter {
  /**
   * Creates a filter from the given values.
   *
   * @param unit
   * @param comparator
   * @param value
   */
  public static createFilter(unit: QuantityUnit, comparator: Comparator, value: number) {
    return new QuantityComparatorValueFilter(unit, comparator, value)
  }
}
