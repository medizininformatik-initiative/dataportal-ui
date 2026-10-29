import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { catchError, map, Observable, throwError } from 'rxjs'
import { AssetsPath } from '../core/assets/AssetsPath'
import { AppConfigProviderService } from '../core/settings/AppConfigProvider.service'
import { AppConfigData } from './model/AppConfig/AppConfigData'

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private readonly http = inject(HttpClient)
  private readonly appConfigService = inject(AppConfigProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Loads the application configuration from a remote JSON file.
   * @returns {Observable<AppConfigData>} void
   */
  public loadAppConfig(): Observable<AppConfigData> {
    return this.http.get<AppConfigData>(AssetsPath.CONFIG_URL).pipe(
      map((config: AppConfigData) => {
        this.appConfigService.setAppConfigMap(config)
        return config
      }),
      catchError((error) => {
        console.error('Could not load AppConfig', error)
        return throwError(() => new Error(`Could not load AppConfig: ${JSON.stringify(error)}`))
      })
    )
  }
}
