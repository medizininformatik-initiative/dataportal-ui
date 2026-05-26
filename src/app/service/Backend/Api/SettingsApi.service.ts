import { BackendService } from '../Backend.service'
import { DataportalConfigData } from 'src/app/config/model/DataPortalConfig/DataportalConfigData'
import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { SettingsPath } from '../Paths/SettingsPath'

@Injectable({
  providedIn: 'root',
})
export class SettingsApiService {
  private http = inject(HttpClient)
  private backendService = inject(BackendService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Retrieves the settings configuration from the backend.
   * @returns - An observable containing the settings configuration.
   */
  public getSettings(): Observable<DataportalConfigData> {
    const url = this.backendService.createUrl(SettingsPath.SETTINGS_ENDPOINT)
    return this.http.get<DataportalConfigData>(url, {
      headers: this.backendService.getHeaders(),
    })
  }
}
