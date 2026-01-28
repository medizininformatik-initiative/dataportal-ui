import { AboutInfoBuilderService } from '../AboutInfo/AboutInfoBuilder.service';
import { ErrorLogProviderService } from './ErrorLogProvider.service';
import { Injectable } from '@angular/core';
import { ValidationReportData } from 'src/app/model/Interface/Validation/ValidationReportData';
import { ValidationResponseData } from 'src/app/core/model/Validation/ValidationResponseData';

@Injectable({
  providedIn: 'root',
})
export class ValidationReportBuilderService {
  constructor(
    private readonly aboutInfoBuilder: AboutInfoBuilderService,
    private errorLogProviderService: ErrorLogProviderService
  ) {}

  /**
   * Builds a complete validation report data structure for download
   */
  public buildValidationReportData(errorLog: ValidationResponseData[]): ValidationReportData {
    return {
      timestamp: new Date().toISOString(),
      totalErrors: errorLog.length,
      issues: this.errorLogProviderService.getCurrentValidationResult(),
      dataportal: this.aboutInfoBuilder.buildAboutInfo(),
      crtdl: this.errorLogProviderService.getCurrentValidatedCRTDL(),
    };
  }
}
