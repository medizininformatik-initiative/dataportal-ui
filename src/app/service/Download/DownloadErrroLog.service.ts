import { AbstractDownloadService } from './AbstractDownload.service';
import { Injectable } from '@angular/core';
import { ValidationReportBuilderService } from '../Validation/ValidationReportBuilder.service';

@Injectable({
  providedIn: 'root',
})
export class DownloadErrorLogService extends AbstractDownloadService {
  constructor(private readonly validationReportBuilder: ValidationReportBuilderService) {
    super();
  }

  public download(filename?: string): void {
    const errorLogData = this.validationReportBuilder.buildValidationReportData();
    const finalFilename = this.createFilename(filename, 'validation-errors', 'iso');
    const blob = this.createJsonBlob(errorLogData);
    this.triggerDownload(blob, `${finalFilename}.json`);
  }
}
