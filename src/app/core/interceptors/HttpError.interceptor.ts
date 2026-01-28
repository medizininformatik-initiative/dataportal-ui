import { catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { HttpErrorHandlerService } from './HttpErrorHandler.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private errorHandler: HttpErrorHandlerService) {}

  /**
   * Intercepts HTTP responses to handle errors globally.
   * @param req
   * @param next
   * @returns
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, req.url)));
  }
}
