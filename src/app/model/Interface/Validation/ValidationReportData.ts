import { AboutInfoData } from '../AboutInfo/AboutInfoData';
import { CRTDLData } from '../CRTDLData';

/**
 * Represents the result of a validation operation.
 */
export interface ValidationReportData {
  timestamp: string
  totalErrors: number
  errors: any[]
  dataportal: AboutInfoData
  crtdl: CRTDLData
  upgrades: any[]
  totalUpgrades: number
}
