import { QuantityUnit } from 'src/app/model/StructuredQuery/QuantityUnit'
import { AbstractQuantityComparatorFilter } from '../../Abstract/Quantity/Comparator/AbstractQuantityComparatorFilter'
import { Comparator } from 'src/app/model/Utilities/Quantity/Comparator'

export class QuantityComparatorValueFilter extends AbstractQuantityComparatorFilter {
  public static createFilter(unit: QuantityUnit, comparator: Comparator, value: number) {
    return new QuantityComparatorValueFilter(unit, comparator, value)
  }
}
