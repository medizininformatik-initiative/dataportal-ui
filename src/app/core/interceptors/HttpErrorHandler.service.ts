import { DataportalErrorHandlerService } from '../DataportalErrorHandlerService';
import { HttpErrorResponse, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IS_FEASIBILITY_REQUEST, IS_VALIDATION } from 'src/app/service/Backend/HttpContextToken';
import { Observable, throwError } from 'rxjs';
import { TypeGuard } from 'src/app/service/TypeGuard/TypeGuard';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorHandlerService {
  private static readonly DEFAULT_RETRY_AFTER_HEADER = 'Retry-After';

  constructor(private dataportalErrorHandler: DataportalErrorHandlerService) {}

  /**
   * Handles HTTP errors and throws appropriate DataportalErrorObjects
   * @param error - The HTTP error response
   * @param request - The HTTP request that resulted in the error
   * @returns Observable that throws an error
   */
  public handleError(error: HttpErrorResponse, request: HttpRequest<any>): Observable<never> {
    const { status, error: errorPayload } = error;

    switch (status) {
      case HttpStatusCode.BadRequest:
        return this.handleBadRequest(errorPayload, request);

      case HttpStatusCode.Unauthorized:
        /* Not implemented */
        return throwError(() => error);

      case HttpStatusCode.TooManyRequests:
        return this.handleTooManyRequests(error, errorPayload, request);

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
  private handleBadRequest(errorPayload: any, request: HttpRequest<any>): Observable<never> {
    const isValidationEndpoint = request.context.get(IS_VALIDATION);
    if (TypeGuard.isValidationPayload(errorPayload) && isValidationEndpoint) {
      return this.dataportalErrorHandler.throwValidationErrorObject(errorPayload, request.url);
    }
    return throwError(() => errorPayload);
  }

  /**
   * Handles TooManyRequests (429) errors
   * @param error - The HTTP error response
   * @param errorPayload - The error payload
   * @param request - The HTTP request that resulted in the error
   * @returns Observable that throws an error
   */
  private handleTooManyRequests(
    error: HttpErrorResponse,
    errorPayload: any,
    request: HttpRequest<any>
  ): Observable<never> {
    const isFeasibilityEndpoint = request.context.get(IS_FEASIBILITY_REQUEST);
    if (TypeGuard.isFeasibilityPayload(errorPayload) && isFeasibilityEndpoint) {
      const retryAfterSeconds = this.extractRetryAfterSeconds(error);
      return this.dataportalErrorHandler.throwFeasibilityErrorObject(
        errorPayload.issues,
        request.url,
        retryAfterSeconds
      );
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
    return this.dataportalErrorHandler.throwInternalServerErrorObject();
  }
}
