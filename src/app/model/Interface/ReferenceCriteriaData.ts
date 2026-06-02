import { AttributeFilterData } from './AttributeFilterData'
import { ContextData } from './ContextData'
import { TerminologyCodeData } from './TerminologyCodeData'
import { TimeRestrictionData } from './TimeRestrictionData'
import { ValueFilterData } from './ValueFilterData'

export interface ReferenceCriteriaData {
  readonly attributeFilters?: AttributeFilterData[]
  readonly termCodes: TerminologyCodeData[]
  readonly context: ContextData
  readonly timeRestriction?: TimeRestrictionData
  readonly valueFilter?: ValueFilterData
}
