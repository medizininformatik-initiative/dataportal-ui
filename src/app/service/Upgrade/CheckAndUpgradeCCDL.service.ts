import { Injectable, inject } from '@angular/core'
import { DataSelection } from '../../model/DataSelection/DataSelection'
import { CRTDLData } from '../../model/Interface/CRTDLData'
import { DataSelectionMainProfileProviderService } from '../DataSelectionMainProfileProvider.service'
import { DataSelection2DataExtraction } from '../Translator/CRTDL/DataSelection2DataExtraction.service'
import { TypeGuard } from '../TypeGuard/TypeGuard'

@Injectable({
  providedIn: 'root',
})
export class CheckAndUpgradeCCDLService {
  private readonly dataSelection2DataExtraction = inject(DataSelection2DataExtraction)
  private readonly dataSelectionMainProfileProviderService = inject(DataSelectionMainProfileProviderService)

  private readonly version = 'http://json-schema.org/to-be-done/schema#'
  private readonly display = ''

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Checks and upgrades CCDL data if necessary for saved data.
   * @param {any} data - The data to check and upgrade
   * @returns {any} The upgraded data if it was in the old format, otherwise returns the original data
   */
  public checkAndUpgradeCCDLAsSavedData(data: any): any {
    if (TypeGuard.isStructuredQueryData(data)) {
      return { content: this.checkAndUpgradeCCDL(data) }
    }
    return data
  }

  /**
   * Checks and upgrades CCDL data if necessary.
   * @param {any} data - The data to check and upgrade
   * @returns {CRTDLData} The upgraded data if it was in the old format, otherwise returns the original data
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
   * @returns {any} The default data extraction
   */
  private buildDefaultDataExtraction(): any {
    const patientProfile = this.dataSelectionMainProfileProviderService.getPatientProfileValue()
    const dse = new DataSelection([patientProfile], 'unknown')
    return JSON.parse(JSON.stringify(this.dataSelection2DataExtraction.translateToDataExtraction(dse)))
  }
}
