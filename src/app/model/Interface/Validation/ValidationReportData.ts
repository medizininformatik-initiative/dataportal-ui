import { AboutInfoData } from '../AboutInfo/AboutInfoData';
import { CRTDLData } from '../CRTDLData';

/**
 * Represents the result of a validation operation.
 */
export interface ValidationReportData {
  timestamp: string
  totalErrors: number
  issues: any
  dataportal: AboutInfoData
  crtdl: CRTDLData
}
