import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { BackendService } from '../Backend.service'
import { Observable } from 'rxjs'
import { TemplatePaths } from '../Paths/TemplatePaths'

@Injectable({
  providedIn: 'root',
})
export class TemplateApiService {
  private backendService = inject(BackendService)
  private http = inject(HttpClient)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public loadTemplate(id: number): Observable<any> {
    const headers = this.backendService.getHeaders()
    return this.http.get<any>(
      this.backendService.createUrl(TemplatePaths.TEMPLATE_QUERY_ENDPOINT + '/' + id.toString()),
      { headers }
    )
  }

  public updateTemplate(id: number, updatedObject: object): Observable<any> {
    const headers = this.backendService.getHeaders()
    const requestBody = updatedObject
    return this.http.put<any>(
      this.backendService.createUrl(TemplatePaths.TEMPLATE_QUERY_ENDPOINT + '/' + id.toString()),
      requestBody,
      {
        headers,
      }
    )
  }

  public deleteSavedTemplate(id: number) {
    const headers = this.backendService.getHeaders()
    const url = this.backendService.createUrl(TemplatePaths.TEMPLATE_QUERY_ENDPOINT + '/' + id)
    return this.http.delete<any>(url, {
      headers,
    })
  }
}
