import { Injectable } from '@angular/core'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { AbstractArrayEntityProvider } from 'src/app/service/Provider/Abstract/AbstractArrayEntityProvider'

@Injectable({
  providedIn: 'root',
})
export class ProfileProviderService extends AbstractArrayEntityProvider<DataSelectionProfile> {
  constructor() {
    super()
  }

  /**
   * Returns the ID of the profile, which is used as the unique identifier in the provider.
   * @param {DataSelectionProfile} profile
   * @returns {string} The ID of the profile.
   */
  protected selectId(profile: DataSelectionProfile): string {
    return profile.getId()
  }
}
