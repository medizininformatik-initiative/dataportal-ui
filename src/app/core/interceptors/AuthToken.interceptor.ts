import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Injectable, Injector, inject } from '@angular/core'
import { OAuthService } from 'angular-oauth2-oidc'
import { Observable } from 'rxjs'

/**
 * HTTP interceptor that automatically adds OAuth bearer tokens to outgoing requests.
 * Excludes certain URLs from token injection (e.g., static assets) and validates
 * token availability before attaching authorization headers.
 */
@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  // lazy: OAuthService injects HttpClient, which injects HTTP_INTERCEPTORS (NG0200)
  private readonly injector = inject(Injector)

  /**
   * List of URL patterns that should be excluded from token injection.
   */
  private readonly excludedUrls = ['assets', '/assets', 'http://localhost:8080/']

  /**
   * Pre-compiled regular expressions for URL matching.
   */
  private readonly excludedUrlsRegEx = this.excludedUrls.map((url: string) => new RegExp('^' + url, 'i'))

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Intercepts HTTP requests and conditionally adds Authorization header with bearer token.
   * @param {HttpRequest<any>} req - The outgoing HTTP request to potentially modify
   * @param {HttpHandler} next - The next handler in the interceptor chain
   * @returns {Observable<HttpEvent<any>>} Observable of HTTP events from the modified or original request
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const shouldExclude = this.excludedUrlsRegEx.some((regex: RegExp) => regex.test(req.url))
    if (shouldExclude) {
      return next.handle(req)
    }

    const modifiedRequest = this.attachTokenIfAvailable(req)
    return next.handle(modifiedRequest)
  }

  /**
   * Creates a cloned request with Authorization header when token exists.
   * @param {HttpRequest<any>} req - The original HTTP request
   * @returns {HttpRequest<any>} Modified request with token or original request if no token available
   */
  private attachTokenIfAvailable(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.getValidToken()
    if (!token) {
      console.warn('No valid token found, request will no have Authorization header')
      return req
    }
    const header = `Bearer ${token}`
    return req.clone({
      setHeaders: { Authorization: header },
    })
  }

  /**
   * Retrieves a valid, non-empty access token from the OAuth service.
   * @returns {OAuthService} Access token string if valid, otherwise null
   */
  private readonly oauthService = (): OAuthService => this.injector.get(OAuthService)

  private getValidToken(): string | null {
    const token = this.oauthService().getAccessToken()

    if (token && typeof token === 'string' && this.oauthService().hasValidAccessToken()) {
      return token
    }
    return null
  }
}
