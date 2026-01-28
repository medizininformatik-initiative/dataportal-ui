import { TerminologyCode } from '../../Terminology/TerminologyCode';
import { AboutInfoData } from '../AboutInfo/AboutInfoData';
import { TerminologyCodeData } from '../TerminologyCodeData';

/**
 * Represents the result of a validation operation.
 */
export interface ValidationReportData {
  timestamp: string
  totalErrors: number
  issues: {
    criteriaSets?: string[]
    termcode?: TerminologyCodeData
    selected?: string
    allowed?: string[]
    afterdate?: string
    beforedate?: string
    selectedConcepts?: TerminologyCodeData
    valueSets?: string[]
  }
  dataportal: AboutInfoData
}
