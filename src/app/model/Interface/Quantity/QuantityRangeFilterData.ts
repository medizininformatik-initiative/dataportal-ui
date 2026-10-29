import { QuantityUnitData } from '../Unit'
import { QuantityTypeData } from './QuantityTypeData'

export interface QuantityRangeFilterData {
  type: QuantityTypeData
  unit: QuantityUnitData
  minValue: number
  maxValue: number
}
