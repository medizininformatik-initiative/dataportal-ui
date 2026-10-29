import { AttributeFilterBaseData } from './AttributeFilterBaseData'
import { ComparatorTypeData } from './ComparatorTypeData'
import { QuantityUnitData } from './Unit'
import { ValueFilterTypeData } from './ValueFilterTypeData'

export interface ValueFilterData extends AttributeFilterBaseData {
  type: ValueFilterTypeData
}
