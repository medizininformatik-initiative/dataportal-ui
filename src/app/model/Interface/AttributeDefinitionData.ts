import { FilterTypes } from '../Utilities/FilterTypes'
import { AttributeCode } from './AttributeCode'
import { DisplayData } from './DisplayData'
import { QuantityUnitData } from './Unit'

export interface AttributeDefinitionData {
  min: number
  max: number
  allowedUnits: QuantityUnitData[]
  attributeCode: AttributeCode
  display: DisplayData
  optional: boolean
  precision: number
  referencedCriteriaSet?: string[]
  referencedValueSet?: string[]
  selectableConcepts: string[]
  type: FilterTypes
}
