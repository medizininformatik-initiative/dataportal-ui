import { catchError, map } from 'rxjs/operators'
import { CRTDLData } from 'src/app/model/Interface/CRTDLData'
import { DataportalErrorData } from 'src/app/core/model/DataportalErrorData'
import { ErrorLogModalComponent } from 'src/app/layout/components/error-log/error-log-modal.component'
import { ErrorLogProviderService } from './ErrorLogProvider.service'
import { Injectable, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable, of, throwError } from 'rxjs'
import { ValidationApiService } from '../../Backend/Api/ValidationApi.service'
import { ValidationReport } from 'src/app/model/Validation/ValidationReport'
import { ValidationIssueData } from 'src/app/core/model/Validation/ValidationIssueData'
import { ValidationIssue } from 'src/app/model/Validation/ValidationIssue'
import { ValidationIssueMapperService } from './ValidationIssueMapper.service'
import { TypeGuard } from '../../TypeGuard/TypeGuard'
import { SnackbarMessageService } from '../../SnackbarMessage.service'

@Injectable({
  providedIn: 'root',
})
export class CRTDLValidationService {
  private readonly validationApiService = inject(ValidationApiService)
  private readonly errorLogProvider = inject(ErrorLogProviderService)
  private readonly validationIssueMapper = inject(ValidationIssueMapperService)
  private matDialog = inject(MatDialog)
  private snackbarMessageService = inject(SnackbarMessageService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public validate(crtdl: CRTDLData, setValidationReport: boolean = true): Observable<boolean> {
    this.errorLogProvider.setValidatedCRTDL(crtdl)
    return this.validationApiService.validateCRTDL(crtdl).pipe(
      map(() => true),
      catchError((error: DataportalErrorData) =>
        setValidationReport ? this.handleValidationError(error) : of(false)
      )
    )
  }

  public handleValidationError(error: DataportalErrorData): Observable<boolean> {
    if (TypeGuard.isValidationError(error)) {
      const payload = error.payload
      const validationReport: ValidationReport = this.buildValidationReport(payload)
      this.errorLogProvider.setValidationResponseData(payload)
      this.errorLogProvider.setValidationResult(validationReport)
      this.opeValidationReportModal(validationReport)
      this.snackbarMessageService.dataDefinitionUploadError()
      return of(false)
    }
    return throwError(() => error)
  }

  public buildValidationReport(errors: ValidationIssueData[]): ValidationReport {
    const validationErrors: ValidationIssue[] = errors.map((error: ValidationIssueData) =>
      this.validationIssueMapper.mapToValidationIssue(error)
    )
    return new ValidationReport(validationErrors)
  }

  private opeValidationReportModal(validationReport: ValidationReport): void {
    this.matDialog.open(ErrorLogModalComponent, {
      data: validationReport,
    })
  }
}
