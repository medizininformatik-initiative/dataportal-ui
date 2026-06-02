import { AboutInfoBuilderService } from '../AboutInfo/AboutInfoBuilder.service'
import { ErrorLogProviderService } from './ErrorLogProvider.service'
import { Injectable, inject } from '@angular/core'
import { ValidationReportData } from 'src/app/model/Interface/Validation/ValidationReportData'

@Injectable({
  providedIn: 'root',
})
export class ValidationReportBuilderService {
  private readonly aboutInfoBuilder = inject(AboutInfoBuilderService)
  private errorLogProviderService = inject(ErrorLogProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Builds a complete validation report data structure for download
   */
  public buildValidationReportData(): ValidationReportData {
    const issues = this.errorLogProviderService.getCurrentValidationResponseData()
    return {
      timestamp: new Date().toISOString(),
      totalErrors: issues?.length || 0,
      errors: issues?.length > 0 ? issues : [],
      totalUpgrades: this.errorLogProviderService.getCurrentUpgradeData()?.annotations?.length || 0,
      upgrades: this.errorLogProviderService.getCurrentUpgradeData()?.annotations || [],
      dataportal: this.aboutInfoBuilder.buildAboutInfo(),
      crtdl: this.errorLogProviderService.getCurrentValidatedCRTDL(),
    }
  }
}
