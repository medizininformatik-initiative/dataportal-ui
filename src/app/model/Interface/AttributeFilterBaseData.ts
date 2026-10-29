import { Comparator } from '../Utilities/Quantity/Comparator'
import { TerminologyCodeData } from './TerminologyCodeData'
import { QuantityUnitData } from './Unit'

export interface AttributeFilterBaseData {
  selectedConcepts: TerminologyCodeData[]
  comparator: Comparator
  minValue?: number
  maxValue?: number
  unit: QuantityUnitData
  value?: number
  precision?: number
}
