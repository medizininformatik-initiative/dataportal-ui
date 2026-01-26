import { DataportalErrorPayloadType } from '../model/DataportalErrorPayloadType';
import { DataportalErrorType } from '../model/DataportalErrorTypes';
import { FeasibilityQueryPaths } from 'src/app/service/Backend/Paths/FeasibilityQueryPaths';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpStatusCode } from './HttpStatusCode';
import { Injectable } from '@angular/core';
import { IssueData } from 'src/app/core/model/Feasibility/IssueData';
import { Observable, throwError } from 'rxjs';
import { ValidationPaths } from 'src/app/service/Backend/Paths/ValidationPaths';
import { ValidationResponseData } from 'src/app/core/model/Validation/ValidationResponseData';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorHandlerService {
  public handleError(error: HttpErrorResponse, requestUrl: string): Observable<never> {
    const status: number = error.status;
    const errorPayload: DataportalErrorPayloadType = error.error;

    switch (status) {
      case HttpStatusCode.BAD_REQUEST:
        if (Array.isArray(errorPayload) && this.isValidationEndpoint(requestUrl)) {
          const payload = errorPayload as ValidationResponseData[];
          return this.throwValidationErrorObject(payload, requestUrl);
        }
        break;

      case HttpStatusCode.UNAUTHORIZED:
        return this.throwFeasibilityErrorObject(errorPayload as IssueData[], requestUrl);

      case HttpStatusCode.FORBIDDEN:
        /** Not implemented */
        break;

      case HttpStatusCode.NOT_FOUND:
        /** Not implemented */
        break;

      case HttpStatusCode.TOO_MANY_REQUESTS:
        if (Array.isArray(errorPayload) && this.isFeasibilityEndpoint(requestUrl)) {
          const payload = errorPayload as IssueData[];
          return this.throwFeasibilityErrorObject(payload, requestUrl);
        }
        break;

      case HttpStatusCode.INTERNAL_SERVER_ERROR:
        return throwError(() => new Error('Something bad happened; please try again later.'));

      default:
        break;
    }

    return throwError(() => error);
  }

  /**
   * Throws a validation error object
   * @param errorPayload
   * @param url
   * @returns
   */
  private throwValidationErrorObject(
    payload: ValidationResponseData[],
    url: string
  ): Observable<never> {
    return this.throwErrorObject('VALIDATION_ERROR', payload, url);
  }

  /**
   * Throws a feasibility error object
   * @param payload
   * @param url
   * @returns
   */
  private throwFeasibilityErrorObject(payload: IssueData[], url: string): Observable<never> {
    return this.throwErrorObject('FEASIBILITY_ERROR', payload, url);
  }

  /**
   * Throws a DataportalErrorObject
   * @param type
   * @param payload
   * @param url
   * @returns
   */
  private throwErrorObject(
    type: DataportalErrorType,
    payload: DataportalErrorPayloadType,
    url: string
  ): Observable<never> {
    return throwError(() => ({ type, payload, url }));
  }

  /**
   * Validates if the url is a validation endpoint
   * @param url
   * @returns
   */
  private isValidationEndpoint(url: string): boolean {
    const endpoints = [
      ValidationPaths.VALIDATE_CRTDL,
      ValidationPaths.VALIDATE_CCDL,
      ValidationPaths.VALIDATE_DATAQUERY,
    ];
    return this.verifyEndpoint(endpoints, url);
  }

  /**
   * Validates if the url is a feasibility endpoint
   * @param url
   * @returns
   */
  private isFeasibilityEndpoint(url: string): boolean {
    const endpoints = [
      FeasibilityQueryPaths.EXECUTE_QUERY,
      FeasibilityQueryPaths.DETAILED_RESULT_RATE_LIMIT,
      FeasibilityQueryPaths.SAVED_QUERY_SLOTS,
    ];
    return this.verifyEndpoint(endpoints, url);
  }

  /**
   * Verifies if the url contains any of the given endpoints
   * @param endpoints
   * @param url
   * @returns
   */
  private verifyEndpoint(endpoints: string[], url: string): boolean {
    return endpoints.some((path) => url.includes(`/${path}`));
  }
}
