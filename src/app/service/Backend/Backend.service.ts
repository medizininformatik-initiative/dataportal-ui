import { AppSettingsProviderService } from '../Config/AppSettingsProvider.service';
import { HttpContext, HttpContextToken, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthStorage } from 'angular-oauth2-oidc';
import {
  AssertionMethod,
  HttpContextTokenOptions,
  IS_FEASIBILITY_REQUEST,
  IS_VALIDATION,
  RESPONSE_ASSERT,
  RESPONSE_GUARD,
  ResponseAssert,
  ResponseGuard,
  SKIP_AUTH,
} from './HttpContextToken';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(
    private authStorage: OAuthStorage,
    private appSettingsProvider: AppSettingsProviderService
  ) {}

  private getAccessToken() {
    return this.authStorage.getItem('access_token');
  }

  public getHeaders() {
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getAccessToken());
  }

  public createUrl(pathToResource: string, paramString?: string): string {
    const apiUrl = this.getBaseUrl() + this.appSettingsProvider.getUiBackendApiPath();
    return this.buildUrl(apiUrl, pathToResource, paramString);
  }

  public getBaseUrl(): string {
    return this.appSettingsProvider.getBackendBaseUrl();
  }

  private buildUrl(base: string, path: string, paramString?: string): string {
    let url = base.endsWith('/') ? base : base + '/';
    url += path;
    if (paramString) {
      url += '?' + paramString;
    }
    return url;
  }

  /**
   * Returns an HttpContext with the validation context token set to true
   * @returns
   */
  public static getValidationContextToken(): HttpContext {
    return new HttpContext().set(IS_VALIDATION, true);
  }

  /**
   * Returns an HttpContext with the feasibility request context token set to true
   * @returns
   */
  public static getFeasibilityRequestContextToken(): HttpContext {
    return new HttpContext().set(IS_FEASIBILITY_REQUEST, true);
  }

  public static createTypeGuardContext<T>(guard: ResponseGuard<T>): HttpContext {
    return new HttpContext().set(RESPONSE_GUARD, guard);
  }

  public static createAssertContextToken(assert: AssertionMethod): HttpContext {
    return new HttpContext().set(RESPONSE_ASSERT, assert);
  }
  /**
   * @param options
   * @example createContext({ guard: (value): value is MyResponseType => { ... }, skipAuth: true, validateResponse: true })
   * @returns HttpContext with the specified options set (e.g. response guard, skipAuth, validateResponse)
   */
  public static createContext<T>(options?: HttpContextTokenOptions<T>): HttpContext {
    let context = new HttpContext();

    if (options?.guard) {
      context = context.set(RESPONSE_GUARD, options.guard);
    }

    if (options?.skipAuth) {
      context = context.set(SKIP_AUTH, true);
    }

    if (options?.validateResponse) {
      context = context.set(IS_VALIDATION, true);
    }

    return context;
  }

  public chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  public chunkArrayForStrings(array: string[], maxUrlLength: number = 1900): string[][] {
    const chunks = [[]];
    let i = 0;
    let length = 0;
    array.forEach((url) => {
      if (length + url.length > maxUrlLength) {
        i++;
        chunks.push([]);
        length = 0;
      }
      length += url.length;
      chunks[i].push(url);
    });
    return chunks;
  }
}
