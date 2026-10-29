import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { BackendService } from '../Backend.service'
import { TemplatePaths } from '../Paths/TemplatePaths'

@Injectable({
  providedIn: 'root',
})
export class TemplateApiService {
  private readonly backendService = inject(BackendService)
  private readonly http = inject(HttpClient)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Loads the template.
   *
   * @param id
   */
  public loadTemplate(id: number): Observable<any> {
    const headers = this.backendService.getHeaders()
    return this.http.get<any>(this.backendService.createUrl(TemplatePaths.TEMPLATE_QUERY_ENDPOINT + '/' + id.toString()), { headers })
  }

  /**
   * Updates the template.
   *
   * @param id
   * @param updatedObject
   */
  public updateTemplate(id: number, updatedObject: object): Observable<any> {
    const headers = this.backendService.getHeaders()
    const requestBody = updatedObject
    return this.http.put<any>(this.backendService.createUrl(TemplatePaths.TEMPLATE_QUERY_ENDPOINT + '/' + id.toString()), requestBody, {
      headers,
    })
  }

  /**
   * Deletes the saved template.
   *
   * @param id
   */
  public deleteSavedTemplate(id: number) {
    const headers = this.backendService.getHeaders()
    const url = this.backendService.createUrl(TemplatePaths.TEMPLATE_QUERY_ENDPOINT + '/' + id)
    return this.http.delete<any>(url, {
      headers,
    })
  }
}
