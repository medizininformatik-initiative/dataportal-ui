import { TerminologyCodeData } from 'src/app/model/Interface/TerminologyCodeData';

/**
 * Value set validation issue details.
 */
export interface ValueSetValidationIssueData {
  type: 'value-set'
  selectedConcepts: TerminologyCodeData
  valueSets: string[]
}
