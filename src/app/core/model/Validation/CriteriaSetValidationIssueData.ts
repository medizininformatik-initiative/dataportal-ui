import { TerminologyCodeData } from 'src/app/model/Interface/TerminologyCodeData';

/**
 * Criteria set validation issue details.
 */
export interface CriteriaSetValidationIssueData {
  type: 'criteria-set'
  criteriaSets: string[]
  termCode: TerminologyCodeData
}
