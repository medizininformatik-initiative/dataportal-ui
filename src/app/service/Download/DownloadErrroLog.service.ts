import { AboutInfoBuilderService } from '../AboutInfo/AboutInfoBuilder.service';
import { AbstractDownloadService } from './AbstractDownload.service';
import { ErrorLogProviderService } from '../Validation/ErrorLogProvider.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DownloadErrorLogService extends AbstractDownloadService {
  constructor(
    private readonly aboutInfoBuilder: AboutInfoBuilderService,
    private readonly errorLogProvider: ErrorLogProviderService
  ) {
    super();
  }

  public download(filename?: string): void {
    const errorLog = this.errorLogProvider.getCurrentValidationResult();

    if (!errorLog.getErrors().length) {
      console.warn('No error log available to download');
      return;
    }

    const errors = errorLog.getErrors().map((error) => ({
      location: error.getLocation(),
      code: error.getCode(),
      message: error.getMessage(),
      details: error.getDetails(),
      selected: error.getQuantityValidationError()?.getSelected(),
      allowed: error.getQuantityValidationError()?.getAllowed(),
      termcode: error.getTermcode(),
      valueSets: error.getValueSets(),
      criteriaSets: error.getCriteriaSets(),
    }));

    const errorLogData = {
      timestamp: errorLog.getTimestamp().toISOString(),
      status: errorLog.getStatus(),
      totalErrors: errorLog.getErrorCount(),
      errors,
      dataportal: this.aboutInfoBuilder.buildAboutInfo(),
    };

    const finalFilename = this.createFilename(filename, 'validation-errors', 'iso');
    const blob = this.createJsonBlob(errorLogData);
    this.triggerDownload(blob, `${finalFilename}.json`);
  }
}
