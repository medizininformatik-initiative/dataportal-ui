import { AboutInfoBuilderService } from '../AboutInfo/AboutInfoBuilder.service';
import { ErrorLogProviderService } from './ErrorLogProvider.service';
import { Injectable } from '@angular/core';
import { ValidationReportData } from 'src/app/model/Interface/Validation/ValidationReportData';

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
  public buildValidationReportData(): ValidationReportData {
    const issues = this.errorLogProviderService.getCurrentValidationResponseData();
    return {
      timestamp: new Date().toISOString(),
      totalErrors: issues.length,
      issues,
      dataportal: this.aboutInfoBuilder.buildAboutInfo(),
      crtdl: this.errorLogProviderService.getCurrentValidatedCRTDL(),
    };
  }
}
