import { ContextData } from './ContextData';
import { TerminologyCodeData } from './TerminologyCodeData';
import { TimeRestrictionData } from './TimeRestrictionData';

export interface ReferenceCriteriaData {
  readonly termCodes: TerminologyCodeData[]
  readonly context: ContextData
  readonly timeRestriction?: TimeRestrictionData
}
