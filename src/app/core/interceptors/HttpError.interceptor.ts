import { catchError, tap } from 'rxjs/operators'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { HttpErrorHandlerService } from './HttpErrorHandler.service'

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private errorHandler = inject(HttpErrorHandlerService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Intercepts HTTP responses to handle errors globally.
   * @param req
   * @param next
   * @returns
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, req)))
  }
}
