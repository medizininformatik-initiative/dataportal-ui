import { BackendService } from '../Backend.service';
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiClient {
  constructor(protected http: HttpClient, protected backendService: BackendService) {}

  /**
   * Performs a GET request to the given backend path.
   * @param path Path relative to the backend base URL
   * @param params Optional query-parameter string
   */
  public get<T>(path: string, params?: string): Observable<T> {
    return this.http.get<T>(this.backendService.createUrl(path, params), {
      headers: this.backendService.getHeaders(),
    });
  }

  /**
   * Performs a GET request and returns the full HttpResponse.
   * @param path Path relative to the backend base URL
   * @param params Optional query-parameter string
   */
  public getResponse<T>(path: string, params?: string): Observable<HttpResponse<T>> {
    return this.http.get<T>(this.backendService.createUrl(path, params), {
      headers: this.backendService.getHeaders(),
      observe: 'response',
    });
  }

  /**
   * Performs a POST request to the given backend path.
   * @param path Path relative to the backend base URL
   * @param body Request body
   * @param context Optional HttpContext (e.g. validation / feasibility tokens)
   */
  public post<T>(path: string, body: unknown, context?: HttpContext): Observable<T> {
    return this.http.post<T>(this.backendService.createUrl(path), body, {
      headers: this.backendService.getHeaders(),
      ...(context && { context }),
    });
  }

  /**
   * Performs a POST request and returns the full HttpResponse.
   * @param path Path relative to the backend base URL
   * @param body Request body
   * @param context Optional HttpContext
   */
  public postResponse<T>(
    path: string,
    body: unknown,
    context?: HttpContext
  ): Observable<HttpResponse<T>> {
    return this.http.post<T>(this.backendService.createUrl(path), body, {
      headers: this.backendService.getHeaders(),
      observe: 'response',
      ...(context && { context }),
    });
  }

  /**
   * Performs a PUT request to the given backend path.
   * @param path Path relative to the backend base URL
   * @param body Request body
   */
  public put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.backendService.createUrl(path), body, {
      headers: this.backendService.getHeaders(),
    });
  }

  /**
   * Performs a DELETE request to the given backend path.
   */
  public delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.backendService.createUrl(path), {
      headers: this.backendService.getHeaders(),
    });
  }
}
