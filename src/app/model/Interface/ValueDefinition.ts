import { FilterTypes } from '../Utilities/FilterTypes'
import { DisplayData } from './DisplayData'
import { TerminologyCodeData } from './TerminologyCodeData'
import { QuantityUnitData } from './Unit'

export interface ValueDefinitionData {
  display: DisplayData
  type: FilterTypes
  selectableConcepts: TerminologyCodeData[]
  optional: boolean
  allowedUnits: QuantityUnitData[]
  precision: number
  referencedCriteriaSet?: string[]
  referencedValueSet?: string[]
  max: number
  min: number
}
