import { AttributeFilterData } from './AttributeFilterData'
import { ContextData } from './ContextData'
import { TerminologyCodeData } from './TerminologyCodeData'
import { TimeRestrictionData } from './TimeRestrictionData'
import { ValueFilterData } from './ValueFilterData'

export interface StructuredQueryCriterionData {
  attributeFilters?: AttributeFilterData[]
  context: ContextData
  termCodes: TerminologyCodeData[]
  timeRestriction?: TimeRestrictionData
  valueFilter?: ValueFilterData
}
