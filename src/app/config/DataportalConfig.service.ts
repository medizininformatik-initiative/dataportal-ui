import { DataportalConfigProviderService } from '../core/settings/DataportalConfigProvider.service'
import { Injectable, inject } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { SettingsApiService } from '../service/Backend/Api/SettingsApi.service'
import { DataportalConfigData } from './model/DataPortalConfig/DataportalConfigData'

@Injectable({
  providedIn: 'root',
})
export class DataportalConfigService {
  private settingsApiService = inject(SettingsApiService)
  private dataPortalConfigProvider = inject(DataportalConfigProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Loads the dataportal configuration from the backend API.
   * @returns An observable of the dataportal configuration.
   */
  public loadDataportalConfig(): Observable<DataportalConfigData> {
    return this.settingsApiService
      .getSettings()
      .pipe(
        tap((config: DataportalConfigData) =>
          this.dataPortalConfigProvider.setDataportalConfig(config)
        )
      )
  }
}
