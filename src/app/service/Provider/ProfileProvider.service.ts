import { AbstractArrayEntityProvider } from 'src/app/service/Provider/Abstract/AbstractArrayEntityProvider';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfileProviderService extends AbstractArrayEntityProvider<DataSelectionProfile> {
  constructor() {
    super();
  }

  /**
   * Returns the ID of the profile, which is used as the unique identifier in the provider.
   * @param profile
   * @returns The ID of the profile.
   */
  protected selectId(profile: DataSelectionProfile): string {
    return profile.getId();
  }
}
