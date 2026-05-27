import { CRTDLData } from '../../model/Interface/CRTDLData'
import { DataSelection } from '../../model/DataSelection/DataSelection'
import { DataSelection2DataExtraction } from '../Translator/CRTDL/DataSelection2DataExtraction.service'
import { DataSelectionMainProfileProviderService } from '../DataSelectionMainProfileProvider.service'
import { Injectable, inject } from '@angular/core'
import { TypeGuard } from '../TypeGuard/TypeGuard'

@Injectable({
  providedIn: 'root',
})
export class CheckAndUpgradeCCDLService {
  private dataSelection2DataExtraction = inject(DataSelection2DataExtraction)
  private dataSelectionMainProfileProviderService = inject(DataSelectionMainProfileProviderService)

  private version = 'http://json-schema.org/to-be-done/schema#'
  private display = ''

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Checks and upgrades CCDL data if necessary for saved data.
   * @param data - The data to check and upgrade
   * @returns The upgraded data if it was in the old format, otherwise returns the original data
   */
  public checkAndUpgradeCCDLAsSavedData(data: any): any {
    if (TypeGuard.isStructuredQueryData(data)) {
      return { content: this.checkAndUpgradeCCDL(data) }
    }
    return data
  }

  /**
   * Checks and upgrades CCDL data if necessary.
   * @param data - The data to check and upgrade
   * @returns The upgraded data if it was in the old format, otherwise returns the original data
   */
  public checkAndUpgradeCCDL(data: any): CRTDLData {
    if (TypeGuard.isStructuredQueryData(data)) {
      return {
        display: this.display,
        version: this.version,
        cohortDefinition: data,
        dataExtraction: this.buildDefaultDataExtraction(),
      }
    }
    return data
  }

  /**
   * Builds the default data extraction.
   * @returns The default data extraction
   */
  private buildDefaultDataExtraction(): any {
    const patientProfile = this.dataSelectionMainProfileProviderService.getPatientProfileValue()
    const dse = new DataSelection([patientProfile], 'unknown')
    return JSON.parse(
      JSON.stringify(this.dataSelection2DataExtraction.translateToDataExtraction(dse))
    )
  }
}
