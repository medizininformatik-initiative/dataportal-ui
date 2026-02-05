import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpContext,
} from '@angular/common/http';

/**
 * HTTP interceptor that automatically adds OAuth bearer tokens to outgoing requests.
 * Excludes certain URLs from token injection (e.g., static assets) and validates
 * token availability before attaching authorization headers.
 */
@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  /**
   * List of URL patterns that should be excluded from token injection.
   */
  private readonly excludedUrls = ['assets', '/assets', 'http://localhost:8080/'];

  /**
   * Pre-compiled regular expressions for URL matching.
   */
  private readonly excludedUrlsRegEx = this.excludedUrls.map((url) => new RegExp('^' + url, 'i'));

  constructor(private oauthService: OAuthService) {}

  /**
   * Intercepts HTTP requests and conditionally adds Authorization header with bearer token.
   * @param req - The outgoing HTTP request to potentially modify
   * @param next - The next handler in the interceptor chain
   * @returns Observable of HTTP events from the modified or original request
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const shouldExclude = this.excludedUrlsRegEx.some((regex) => regex.test(req.url));
    if (shouldExclude) {
      return next.handle(req);
    }

    const modifiedRequest = this.attachTokenIfAvailable(req);
    return next.handle(modifiedRequest);
  }

  /**
   * Creates a cloned request with Authorization header when token exists.
   * @param req - The original HTTP request
   * @returns Modified request with token or original request if no token available
   */
  private attachTokenIfAvailable(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.getValidToken();
    if (!token) {
      console.warn('No valid token found, request will no have Authorization header');
      return req;
    }
    const header = `Bearer ${token}`;
    return req.clone({
      setHeaders: { Authorization: header },
    });
  }

  /**
   * Retrieves a valid, non-empty access token from the OAuth service.
   * @returns Access token string if valid, otherwise null
   */
  private getValidToken(): string | null {
    const token = this.oauthService.getAccessToken();

    if (token && typeof token === 'string' && this.oauthService.hasValidAccessToken()) {
      return token;
    }
    return null;
  }
}
