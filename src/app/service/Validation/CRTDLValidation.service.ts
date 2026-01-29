import { catchError, map } from 'rxjs/operators';
import { CRTDLData } from 'src/app/model/Interface/CRTDLData';
import { DataportalErrorData } from 'src/app/core/model/DataportalErrorData';
import { ErrorLogModalComponent } from 'src/app/layout/components/error-log/error-log-modal.component';
import { ErrorLogProviderService } from './ErrorLogProvider.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, throwError } from 'rxjs';
import { ValidationApiService } from '../Backend/Api/ValidationApi.service';
import { ValidationReport } from 'src/app/model/Validation/ValidationReport';
import { ValidationResponseData } from 'src/app/core/model/Validation/ValidationResponseData';
import { ValidationIssue } from 'src/app/model/Validation/ValidationIssue';
import { ValidationIssueMapperService } from './ValidationIssueMapper.service';
import { TypeGuard } from '../TypeGuard/TypeGuard';

@Injectable({
  providedIn: 'root',
})
export class CRTDLValidationService {
  constructor(
    private readonly validationApiService: ValidationApiService,
    private readonly errorLogProvider: ErrorLogProviderService,
    private readonly validationIssueMapper: ValidationIssueMapperService,
    private matDialog: MatDialog
  ) {}

  public validate(crtdl: CRTDLData): Observable<boolean> {
    this.errorLogProvider.setValidatedCRTDL(crtdl);
    return this.validationApiService.validateCRTDL(crtdl).pipe(
      map(() => true),
      catchError((error: DataportalErrorData) => this.handleValidationError(error))
    );
  }

  private handleValidationError(error: DataportalErrorData): Observable<boolean> {
    if (error.type === 'VALIDATION_ERROR' && Array.isArray(error.payload)) {
      const payload = error.payload as ValidationResponseData[];
      const validationReport = this.buildValidationReport(payload);
      this.errorLogProvider.setValidationResponseData(payload);
      this.errorLogProvider.setValidationResult(validationReport);
      this.opeValidationReportModal(validationReport);
      return of(false);
    }
    return throwError(() => error);
  }

  public buildValidationReport(errors: ValidationResponseData[]): ValidationReport {
    const validationErrors: ValidationIssue[] = errors.map((error: ValidationResponseData) =>
      this.validationIssueMapper.mapToValidationIssue(error)
    );
    return new ValidationReport(validationErrors);
  }

  private opeValidationReportModal(validationReport: ValidationReport): void {
    this.matDialog.open(ErrorLogModalComponent, {
      data: validationReport,
    });
  }
}
