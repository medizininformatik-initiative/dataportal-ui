import { DataportalErrorPayloadType } from './model/DataportalErrorPayloadType'
import { DataportalErrorType } from './model/DataportalErrorTypes'
import { ErrorDisplayService } from '../shared/service/ErrorDisplay/error-display.service'
import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { IssueData } from './model/Feasibility/IssueData'
import { Observable, throwError } from 'rxjs'
import { ValidationIssueData } from './model/Validation/ValidationIssueData'
@Injectable({ providedIn: 'root' })
export class DataportalErrorHandlerService implements ErrorHandler {
  private zone = inject(NgZone)
  private errorDisplayService = inject(ErrorDisplayService)

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
        this.errorDisplayService.showError(
          dataportalError.payload,
          dataportalError.type as any,
          dataportalError.url
        )
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
    return (
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      'payload' in error &&
      'url' in error
    )
  }

  /**
   * Throws a validation error object
   * @param payload - The validation issue data
   * @param url - The URL of the failed request
   * @returns Observable that throws a validation error
   */
  public throwValidationErrorObject(
    payload: ValidationIssueData[],
    url: string
  ): Observable<never> {
    return this.throwErrorObject('VALIDATION_ERROR', payload, url)
  }

  /**
   * Throws a feasibility error object
   * @param payload - The feasibility issue data
   * @param url - The URL of the failed request
   * @param [retryAfterSeconds] - Optional seconds to wait before retrying
   * @returns Observable that throws a feasibility error
   */
  public throwFeasibilityErrorObject(
    payload: IssueData[],
    url: string,
    retryAfterSeconds?: number
  ): Observable<never> {
    return this.throwErrorObject('FEASIBILITY_ERROR', payload, url, retryAfterSeconds)
  }

  /**
   * Throws a generic error object that keeps status, message and URL of a failed request
   * @param error - The HTTP error response
   * @param url - The URL of the failed request, including query parameters
   * @returns Observable that throws a generic error
   */
  public throwHttpErrorObject(error: HttpErrorResponse, url: string): Observable<never> {
    const body = error.error
    const backendMessage =
      typeof body === 'string' ? body : body?.message || body?.detail || body?.error
    const payload: IssueData[] = [
      {
        message: backendMessage || error.message,
        type: 'HttpError',
        code: String(error.status),
        severity: 'ERROR',
      },
    ]
    return this.throwErrorObject('GENERIC_ERROR', payload, url)
  }

  /**
   * Throws a DataportalErrorObject
   * @param type - The type of error
   * @param payload - The error payload
   * @param url - The URL of the failed request
   * @param [retryAfterSeconds] - Optional seconds to wait before retrying
   * @returns Observable that throws the error object
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
