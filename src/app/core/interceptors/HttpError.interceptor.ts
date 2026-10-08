import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable, Injector, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpErrorHandlerService } from './HttpErrorHandler.service'

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  // lazy: handler -> TranslateService -> HttpClient -> HTTP_INTERCEPTORS (NG0200)
  private injector = inject(Injector)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  /**
   *
   */
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
      .pipe(catchError((error: HttpErrorResponse) => this.injector.get(HttpErrorHandlerService).handleError(error, req)))
  }
}
