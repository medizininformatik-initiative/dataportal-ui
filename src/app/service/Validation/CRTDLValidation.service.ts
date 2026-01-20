import { ValidationResponseData } from 'src/app/model/Interface/Validation/BackendValidationError';
import { catchError, map } from 'rxjs/operators';
import { DataQueryApiService } from '../Backend/Api/DataQueryApi.service';
import { ErrorLogProviderService } from './ErrorLogProvider.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ErrorLog } from 'src/app/model/Validation/ErrorLog';
import { ValidationError } from 'src/app/model/Validation/ValidationError';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { QuantityValidationError } from 'src/app/model/Validation/QuantityValidationError';

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
    private readonly dataQueryApiService: DataQueryApiService,
    private readonly errorLogProvider: ErrorLogProviderService
  ) {}

  public validateCRTDL(crtdl: unknown): any {
    return this.dataQueryApiService.validateDataQuery(crtdl).pipe(
      map((validationReport: HttpResponse<ValidationResponseData>) => {
        console.log('Validation report received:', validationReport);
      }),
      catchError((error: HttpErrorResponse) => this.handleValidationError(error))
    );
  }

  private handleValidationError(error: HttpErrorResponse): Observable<ValidationResponseData> {
    if (Array.isArray(error.error)) {
      const errorLog = this.buildErrorLog(error.error);
      this.errorLogProvider.setValidationResult(errorLog);
      return throwError(() => errorLog);
    }
  }

  public buildErrorLog(errors: ValidationResponseData[]): ErrorLog {
    const validationErrors: ValidationError[] = errors.map(
      this.transformToValidationError.bind(this)
    );
    console.log('Transformed validation errors:', validationErrors);
    return new ErrorLog(VALIDATION_STATUS.FAILED, validationErrors);
  }

  private transformToValidationError(error: ValidationResponseData): ValidationError {
    const location = this.pathToLocation(error.path);
    console.log(error.value.termcode);
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
