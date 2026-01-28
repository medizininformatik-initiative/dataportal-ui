import { AbstractDownloadService } from './AbstractDownload.service';
import { ErrorLogProviderService } from '../Validation/ErrorLogProvider.service';
import { Injectable } from '@angular/core';
import { ValidationReportBuilderService } from '../Validation/ValidationReportBuilder.service';

@Injectable({
  providedIn: 'root',
})
export class DownloadErrorLogService extends AbstractDownloadService {
  constructor(
    private readonly errorLogProvider: ErrorLogProviderService,
    private readonly validationReportBuilder: ValidationReportBuilderService
  ) {
    super();
  }

  public download(filename?: string): void {
    const errorLog = this.errorLogProvider.getCurrentValidationResult();
    const issues = errorLog;

    if (!issues.length) {
      console.warn('No error log available to download');
      return;
    }

    const errorLogData = this.validationReportBuilder.buildValidationReportData(errorLog);

    const finalFilename = this.createFilename(filename, 'validation-errors', 'iso');
    const blob = this.createJsonBlob(errorLogData);
    this.triggerDownload(blob, `${finalFilename}.json`);
  }
}
