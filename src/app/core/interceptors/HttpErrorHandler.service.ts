import { DataportalErrorPayloadType } from '../model/DataportalErrorPayloadType';
import { DataportalErrorType } from '../model/DataportalErrorTypes';
import { FeasibilityQueryPaths } from 'src/app/service/Backend/Paths/FeasibilityQueryPaths';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IssueData } from 'src/app/core/model/Feasibility/IssueData';
import { Observable, throwError } from 'rxjs';
import { TypeGuard } from 'src/app/service/TypeGuard/TypeGuard';
import { ValidationIssueData } from 'src/app/core/model/Validation/ValidationIssueData';
import { ValidationPaths } from 'src/app/service/Backend/Paths/ValidationPaths';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorHandlerService {
  private static readonly GENERIC_ERROR_MESSAGE = 'Something bad happened; please try again later.';
  private static readonly DEFAULT_RETRY_AFTER_HEADER = 'Retry-After';

  private readonly validationEndpoints: readonly string[] = [
    ValidationPaths.VALIDATE_CRTDL,
    ValidationPaths.VALIDATE_CCDL,
    ValidationPaths.VALIDATE_DATAQUERY,
  ];

  private readonly feasibilityEndpoints: readonly string[] = [
    FeasibilityQueryPaths.EXECUTE_QUERY,
    FeasibilityQueryPaths.DETAILED_RESULT_RATE_LIMIT,
    FeasibilityQueryPaths.SAVED_QUERY_SLOTS,
  ];
  /**
   * Handles HTTP errors and throws appropriate DataportalErrorObjects
   * @param error - The HTTP error response
   * @param requestUrl - The URL of the failed request
   * @returns Observable that throws an error
   */
  public handleError(error: HttpErrorResponse, requestUrl: string): Observable<never> {
    const { status, error: errorPayload } = error;

    switch (status) {
      case HttpStatusCode.BadRequest:
        return this.handleBadRequest(errorPayload, requestUrl);

      case HttpStatusCode.Unauthorized:
        return this.throwFeasibilityErrorObject(errorPayload as IssueData[], requestUrl);

      case HttpStatusCode.TooManyRequests:
        return this.handleTooManyRequests(error, errorPayload, requestUrl);

      case HttpStatusCode.InternalServerError:
        return this.handleInternalServerError();

      default:
        return throwError(() => error);
    }
  }

  /**
   * Handles BadRequest (400) errors
   * @param errorPayload - The error payload
   * @param requestUrl - The URL of the failed request
   * @returns Observable that throws an error
   */
  private handleBadRequest(errorPayload: any, requestUrl: string): Observable<never> {
    if (TypeGuard.isValidationPayload(errorPayload) && this.isValidationEndpoint(requestUrl)) {
      return this.throwValidationErrorObject(errorPayload, requestUrl);
    }
    return throwError(
      () =>
        new HttpErrorResponse({
          error: errorPayload,
          status: HttpStatusCode.BadRequest,
          url: requestUrl,
        })
    );
  }

  /**
   * Handles TooManyRequests (429) errors
   * @param error - The HTTP error response
   * @param errorPayload - The error payload
   * @param requestUrl - The URL of the failed request
   * @returns Observable that throws an error
   */
  private handleTooManyRequests(
    error: HttpErrorResponse,
    errorPayload: any,
    requestUrl: string
  ): Observable<never> {
    if (TypeGuard.isFeasibilityPayload(errorPayload) && this.isFeasibilityEndpoint(requestUrl)) {
      const retryAfterSeconds = this.extractRetryAfterSeconds(error);
      return this.throwFeasibilityErrorObject(errorPayload.issues, requestUrl, retryAfterSeconds);
    }
    return throwError(() => error);
  }

  /**
   * Extracts retry-after seconds from HTTP headers
   * @param error - The HTTP error response
   * @returns The number of seconds to wait before retrying, or undefined
   */
  private extractRetryAfterSeconds(error: HttpErrorResponse): number | undefined {
    const retryAfterHeader = error.headers.get(HttpErrorHandlerService.DEFAULT_RETRY_AFTER_HEADER);
    return retryAfterHeader ? parseInt(retryAfterHeader, 10) : undefined;
  }

  /**
   * Handles InternalServerError (500) errors
   * @returns Observable that throws a generic error
   */
  private handleInternalServerError(): Observable<never> {
    return throwError(() => new Error(HttpErrorHandlerService.GENERIC_ERROR_MESSAGE));
  }

  /**
   * Throws a validation error object
   * @param payload - The validation issue data
   * @param url - The URL of the failed request
   * @returns Observable that throws a validation error
   */
  private throwValidationErrorObject(
    payload: ValidationIssueData[],
    url: string
  ): Observable<never> {
    return this.throwErrorObject('VALIDATION_ERROR', payload, url);
  }

  /**
   * Throws a feasibility error object
   * @param payload - The feasibility issue data
   * @param url - The URL of the failed request
   * @param [retryAfterSeconds] - Optional seconds to wait before retrying
   * @returns Observable that throws a feasibility error
   */
  private throwFeasibilityErrorObject(
    payload: IssueData[],
    url: string,
    retryAfterSeconds?: number
  ): Observable<never> {
    return this.throwErrorObject('FEASIBILITY_ERROR', payload, url, retryAfterSeconds);
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
    return throwError(() => ({ type, payload, url, retryAfterSeconds }));
  }

  /**
   * Validates if the url is a validation endpoint
   * @param url - The URL to validate
   * @returns True if the URL is a validation endpoint
   */
  private isValidationEndpoint(url: string): boolean {
    return this.verifyEndpoint(this.validationEndpoints, url);
  }

  /**
   * Validates if the url is a feasibility endpoint
   * @param url - The URL to validate
   * @returns True if the URL is a feasibility endpoint
   */
  private isFeasibilityEndpoint(url: string): boolean {
    return this.verifyEndpoint(this.feasibilityEndpoints, url);
  }

  /**
   * Verifies if the url contains any of the given endpoints
   * @param endpoints - Array of endpoint paths to check against
   * @param url - The URL to verify
   * @returns True if the URL contains any of the endpoints
   */
  private verifyEndpoint(endpoints: readonly string[], url: string): boolean {
    return endpoints.some((path) => url.includes(`/${path}`));
  }
}
