import { AppSettingsProviderService } from './Config/AppSettingsProvider.service';
import { DataSelectionProfile } from '../model/DataSelection/Profile/DataSelectionProfile';
import { filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoadDataSelectionProfilesService } from './DataSelection/LoadDataSelectionProfiles.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataSelectionMainProfileInitializerService {
  constructor(
    private loadDataSelectionProfilesService: LoadDataSelectionProfilesService,
    private appSettingsProviderService: AppSettingsProviderService
  ) {}

  /**
   * @todo set Profile in DataSelectionProviderService
   * @param patientProfileUrl
   * @returns Observable<DataSelectionProfile>
   */
  public initializePatientProfile(): Observable<DataSelectionProfile> {
    const mainProfileUrl = this.appSettingsProviderService.getDsePatientProfileUrl();
    return this.loadDataSelectionProfilesService.loadProfiles([mainProfileUrl], true).pipe(
      filter((profiles) => !!profiles && profiles.length > 0),
      map((profiles) => profiles[0])
    );
  }
}
