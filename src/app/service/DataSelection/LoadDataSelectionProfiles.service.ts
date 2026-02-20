import { concatMap, map, Observable } from 'rxjs';
import { DataSelectionApiService } from '../Backend/Api/DataSelectionApi.service';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { DataSelectionProfileData } from 'src/app/model/Interface/DataSelectionProfileData';
import { Injectable } from '@angular/core';
import { ProfileInstanceBuilderService } from './Builder/ProfileInstanceBuilder.service';
import { ProfileProviderService } from 'src/app/modules/data-selection/services/ProfileProvider.service';

@Injectable({
  providedIn: 'root',
})
export class LoadDataSelectionProfilesService {
  constructor(
    private dataSelectionApiService: DataSelectionApiService,
    private profileProvider: ProfileProviderService,
    private profileInstanceBuilder: ProfileInstanceBuilderService
  ) {}

  /**
   * Fetches data selection profile data from the API, assembles profile objects,
   * registers them in the profile provider, and emits the resulting array.
   * @param urls The profile URLs to fetch.
   * @param markAsReference Whether to mark the profiles as references.
   * @returns An observable that emits the fetched DataSelectionProfile array.
   */
  public loadProfiles(
    urls: string[],
    markAsReference: boolean = false
  ): Observable<DataSelectionProfile[]> {
    return this.dataSelectionApiService.getDataSelectionProfileData(urls).pipe(
      map((data: DataSelectionProfileData[]) =>
        this.profileInstanceBuilder.buildProfileInstances(data, markAsReference)
      ),
      concatMap((profiles) => {
        this.setProfilesInProvider(profiles);
        return [profiles];
      })
    );
  }

  private setProfilesInProvider(profiles: DataSelectionProfile[]): void {
    profiles.forEach((profile) => this.profileProvider.setProfileById(profile.getId(), profile));
  }
}
