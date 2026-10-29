import { DataSelectionProfile } from '../../DataSelection/Profile/DataSelectionProfile'
import { ProfileReference } from '../../DataSelection/Profile/Reference/ProfileReference'
import { CloneDisplayData } from '../DisplayData/CloneDisplayData'
import { ProfileFieldsCloner } from './ProfileFieldsCloner'
import { ProfileFilterCloner } from './ProfileFilterCloner'

export class DataSelectionProfileCloner {
  public static deepCopyProfiles(profiles: DataSelectionProfile[]): DataSelectionProfile[] {
    return profiles.map((profile: DataSelectionProfile) => this.deepCopyProfile(profile))
  }
  /**
   * Clones a DataSelectionProfile object.
   * @param {DataSelectionProfile} profile The DataSelectionProfile to clone.
   * @returns {DataSelectionProfile} A deep copy of the DataSelectionProfile.
   * @param {string} profileId
   */
  public static deepCopyProfile(profile: DataSelectionProfile, profileId?: string): DataSelectionProfile {
    const clonedFields = ProfileFieldsCloner.deepCopyProfileFields(profile.getProfileFields())
    const clonedFilters = ProfileFilterCloner.deepCopyFilters(profile.getFilters())
    const clonedDisplay = CloneDisplayData.deepCopyDisplayData(profile.getDisplay())
    const clonedReference = new ProfileReference(
      profile.getReference().getIncludeReferenceOnly(),
      profile.getReference().getIsReferenceSet()
    )
    return new DataSelectionProfile(
      profileId ? profileId : profile.getId(),
      profile.getUrl(),
      clonedDisplay,
      clonedFields,
      clonedFilters,
      clonedReference,
      profile.getLabel(),
      profile.getLabelNumber()
    )
  }
}
