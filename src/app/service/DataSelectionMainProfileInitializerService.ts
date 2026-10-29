import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { DataSelectionProfile } from '../model/DataSelection/Profile/DataSelectionProfile'
import { AppSettingsProviderService } from './Config/AppSettingsProvider.service'
import { LoadDataSelectionProfilesService } from './DataSelection/LoadDataSelectionProfiles.service'

@Injectable({
  providedIn: 'root',
})
export class DataSelectionMainProfileInitializerService {
  private readonly loadDataSelectionProfilesService = inject(LoadDataSelectionProfilesService)
  private readonly appSettingsProviderService = inject(AppSettingsProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Initializes the patient profile by loading it from the backend using the URL specified in the app settings.
   * @returns {Observable<DataSelectionProfile>}
   */
  public initializePatientProfile(): Observable<DataSelectionProfile> {
    const mainProfileUrl = this.appSettingsProviderService.getDsePatientProfileUrl()
    return this.loadDataSelectionProfilesService.loadProfiles([mainProfileUrl]).pipe(
      filter((profiles) => !!profiles && profiles.length > 0),
      map((profiles) => profiles[0])
    )
  }
}
