import { catchError, map } from 'rxjs/operators';
import { CRTDLData } from 'src/app/model/Interface/CRTDLData';
import { DataportalErrorType } from 'src/app/core/model/DataportalErrorTypes';
import { ErrorLog } from 'src/app/model/Validation/ErrorLog';
import { ErrorLogProviderService } from './ErrorLogProvider.service';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { QuantityValidationError } from 'src/app/model/Validation/QuantityValidationError';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { ValidationApiService } from '../Backend/Api/ValidationApi.service';
import { ValidationError } from 'src/app/model/Validation/ValidationError';
import { ValidationResponseData } from 'src/app/core/model/Validation/ValidationResponseData';
import { DataportalErrorData } from 'src/app/core/model/DataportalErrorData';
import { MatDialog } from '@angular/material/dialog';
import { ErrorLogModalComponent } from 'src/app/layout/components/error-log/error-log-modal.component';

const VALIDATION_STATUS = {
  SUCCESS: 'validation_success',
  FAILED: 'validation_failed',
} as const;

const PATH_PREFIX = /^content\//;
const NUMERIC_SEGMENT = /^\d+$/;

@Injectable({
  providedIn: 'root',
})
export class CRTDLValidationService {
  constructor(
    private readonly validationApiService: ValidationApiService,
    private readonly errorLogProvider: ErrorLogProviderService,
    private matDialog: MatDialog
  ) {}

  public validate(crtdl: CRTDLData): Observable<boolean> {
    return this.validationApiService.validateCRTDL(crtdl).pipe(
      map(() => true),
      catchError((error: DataportalErrorData) => this.handleValidationError(error))
    );
  }

  private handleValidationError(error: DataportalErrorData): Observable<boolean> {
    if (error.type === 'VALIDATION_ERROR') {
      const payload = error.payload as ValidationResponseData[];
      const errorLog = this.buildErrorLog(payload);
      this.errorLogProvider.setValidationResult(errorLog);
      this.matDialog.open(ErrorLogModalComponent, {
        data: errorLog,
      });
      return of(false);
    }
    return throwError(() => error);
  }

  public buildErrorLog(errors: ValidationResponseData[]): ErrorLog {
    const validationErrors: ValidationError[] = errors.map(
      this.transformToValidationError.bind(this)
    );
    return new ErrorLog(VALIDATION_STATUS.FAILED, validationErrors);
  }

  private transformToValidationError(error: ValidationResponseData): ValidationError {
    const location = this.pathToLocation(error.path);
    const termcode = error.value.termcode
      ? TerminologyCode.fromJson(error.value.termcode)
      : undefined;
    const quantityValidationError =
      error.value.selected !== undefined && error.value.allowed !== undefined;
    return new ValidationError(
      location,
      error.value.code,
      error.value.message,
      undefined,
      quantityValidationError
        ? new QuantityValidationError(error.value.selected, error.value.allowed)
        : undefined,
      termcode,
      error.value.valueSets?.length ? error.value.valueSets : undefined,
      error.value.criteriaSets?.length ? error.value.criteriaSets : undefined
    );
  }

  /**
   * Converts backend path format to UI-readable format.
   * @example
   * "content/cohortDefinition/inclusionCriteria/0/0/termCodes/0"
   * becomes
   * "cohortDefinition.inclusionCriteria[0][0].termCodes[0]"
   */
  private pathToLocation(path: string): string {
    return path
      .replace(PATH_PREFIX, '')
      .split('/')
      .map((segment) => (NUMERIC_SEGMENT.test(segment) ? `[${segment}]` : segment))
      .join('.')
      .replace(/\.\[/g, '[');
  }
}
