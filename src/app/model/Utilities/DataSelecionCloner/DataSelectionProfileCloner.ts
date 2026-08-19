import { CloneDisplayData } from '../DisplayData/CloneDisplayData'
import { DataSelectionProfile } from '../../DataSelection/Profile/DataSelectionProfile'
import { ProfileFieldsCloner } from './ProfileFieldsCloner'
import { ProfileFilterCloner } from './ProfileFilterCloner'
import { ProfileReference } from '../../DataSelection/Profile/Reference/ProfileReference'

export class DataSelectionProfileCloner {
  public static deepCopyProfiles(profiles: DataSelectionProfile[]): DataSelectionProfile[] {
    return profiles.map((profile) => this.deepCopyProfile(profile))
  }
  /**
   * Clones a DataSelectionProfile object.
   * @param profile The DataSelectionProfile to clone.
   * @returns A deep copy of the DataSelectionProfile.
   */
  public static deepCopyProfile(
    profile: DataSelectionProfile,
    profileId?: string
  ): DataSelectionProfile {
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
