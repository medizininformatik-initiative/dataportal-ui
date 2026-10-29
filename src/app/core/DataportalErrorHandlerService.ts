import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable, throwError } from 'rxjs'
import { ErrorDisplayService } from '../shared/service/ErrorDisplay/error-display.service'
import { CohortTranslationError } from './model/CohortTranslationError'
import { DataportalErrorPayloadType } from './model/DataportalErrorPayloadType'
import { DataportalErrorType } from './model/DataportalErrorTypes'
import { IssueData } from './model/Feasibility/IssueData'
import { ValidationIssueData } from './model/Validation/ValidationIssueData'
@Injectable({ providedIn: 'root' })
export class DataportalErrorHandlerService implements ErrorHandler {
  private readonly zone = inject(NgZone)
  private readonly errorDisplayService = inject(ErrorDisplayService)
  private readonly translate = inject(TranslateService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public handleError(error: unknown): void {
    this.zone.run(() => {
      if (this.isDataportalError(error)) {
        const dataportalError = error as {
          type: string
          payload: DataportalErrorPayloadType
          url: string
        }
        this.errorDisplayService.showError(dataportalError.payload, dataportalError.type as any, dataportalError.url)
      } else if (error instanceof CohortTranslationError) {
        const message = this.translate.instant(`ERROR.${error.code}`, {
          ids: error.criterionIds.join(', '),
        })
        this.errorDisplayService.showError([{ message, type: 'Error', code: error.code, severity: 'ERROR' }], 'GENERIC_ERROR', '')
      } else {
        const errorMessage = error instanceof Error ? error.message : String(error)
        const errorPayload: DataportalErrorPayloadType = [
          {
            message: errorMessage,
            type: 'Error',
            code: 'UNKNOWN',
            severity: 'ERROR',
          },
        ]
        this.errorDisplayService.showError(errorPayload, 'GENERIC_ERROR' as any, '')
      }
    })
  }

  private isDataportalError(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'type' in error && 'payload' in error && 'url' in error
  }

  /**
   * Throws a validation error object
   * @param {ValidationIssueData[]} payload - The validation issue data
   * @param {string} url - The URL of the failed request
   * @returns {Observable<never>} Observable that throws a validation error
   */
  public throwValidationErrorObject(payload: ValidationIssueData[], url: string): Observable<never> {
    return this.throwErrorObject('VALIDATION_ERROR', payload, url)
  }

  /**
   * Throws a feasibility error object
   * @param {IssueData[]} payload - The feasibility issue data
   * @param {string} url - The URL of the failed request
   * @param {number} [retryAfterSeconds] - Optional seconds to wait before retrying
   * @returns {Observable<never>} Observable that throws a feasibility error
   */
  public throwFeasibilityErrorObject(payload: IssueData[], url: string, retryAfterSeconds?: number): Observable<never> {
    return this.throwErrorObject('FEASIBILITY_ERROR', payload, url, retryAfterSeconds)
  }

  /**
   * Throws an internal server error as an observable.
   * @todod Needs to be define
   * @returns {Observable<never>}
   */
  public throwInternalServerErrorObject(): Observable<never> {
    return this.throwErrorObject('GENERIC_ERROR', undefined, '')
  }

  /**
   * Throws a DataportalErrorObject
   * @param {DataportalErrorType} type - The type of error
   * @param {DataportalErrorPayloadType} payload - The error payload
   * @param {string} url - The URL of the failed request
   * @param {number} [retryAfterSeconds] - Optional seconds to wait before retrying
   * @returns {Observable<never>} Observable that throws the error object
   */
  private throwErrorObject(
    type: DataportalErrorType,
    payload: DataportalErrorPayloadType,
    url: string,
    retryAfterSeconds?: number
  ): Observable<never> {
    return throwError(() => ({ type, payload, url, retryAfterSeconds }))
  }
}
