import { ValueFilterTypeData } from './ValueFilterTypeData'
import { AttributeFilterBaseData } from './AttributeFilterBaseData'

export interface ValueFilterData extends AttributeFilterBaseData {
  type: ValueFilterTypeData
}
