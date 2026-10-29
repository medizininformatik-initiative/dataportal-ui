import { QuantityUnit } from 'src/app/model/StructuredQuery/QuantityUnit'
import { AbstractQuantityRangeFilter } from '../../Abstract/Quantity/Range/AbstractQuantityRangeFilter'

export class QuantityRangeValueFilter extends AbstractQuantityRangeFilter {
  /**
   * Creates a filter from the given values.
   *
   * @param minValue
   * @param maxValue
   * @param unit
   */
  public static createFilter(minValue: number, maxValue: number, unit: QuantityUnit) {
    return new QuantityRangeValueFilter(minValue, maxValue, unit)
  }
}
