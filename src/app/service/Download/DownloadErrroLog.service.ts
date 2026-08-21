import { AbstractDownloadService } from './AbstractDownload.service'
import { Injectable, inject } from '@angular/core'
import { ValidationReportBuilderService } from '../Validation/External/ValidationReportBuilder.service'

@Injectable({
  providedIn: 'root',
})
export class DownloadErrorLogService extends AbstractDownloadService {
  private readonly validationReportBuilder = inject(ValidationReportBuilderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    super()
  }

  /**
   * Downloads the validation error log as a JSON file.
   * @param filename - Optional custom filename (without extension)
   */
  public download(filename?: string): void {
    const errorLogData = this.validationReportBuilder.buildValidationReportData()
    const finalFilename = this.createFilename(filename, 'validation-errors', 'iso')
    const blob = this.createJsonBlob(errorLogData)
    this.triggerDownload(blob, `${finalFilename}.json`)
  }
}
