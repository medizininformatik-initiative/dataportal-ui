import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { Injectable } from '@angular/core'

export enum ProfileStateType {
  BasicFieldsSetButReferenceNotSet,
  BasicFieldsSetAndReferenceSet,
  NoBasicFieldsSetButReferencesSet,
  NoBasicFieldsSetAndNoReferencesSet,
}

export interface ProfileValidationState {
  profileId: string
  isValid: boolean
  state: ProfileStateType
  referenceFieldId?: string
}

@Injectable({
  providedIn: 'root',
})
export class ProfileValidationService {
  constructor() {}

  /**
   * Returns an array of ProfileValidationState for the given profiles.
   * @param {DataSelectionProfile[]} profiles
   * @returns {ProfileValidationState[]}
   */
  public validateMany(profiles: DataSelectionProfile[]): ProfileValidationState[] {
    return profiles.map((profile) => this.validate(profile))
  }

  /**
   * Returns the validation state for a given profile.
   * @param {DataSelectionProfile} profile
   * @returns {ProfileValidationState}
   */
  public validate(profile: DataSelectionProfile): ProfileValidationState {
    const hasUnlinkedReferences =
      profile.getProfileFields().getUnlinkedRequiredOrRecommendedReferences().length > 0
    const basicFieldsSet = profile.getProfileFields().getSelectedBasicFields().length > 0
    const referenceFieldsSet = profile.getProfileFields().getSelectedReferenceFields().length > 0
    const referenceFieldId = this.getUnlinkedReferenceFieldId(profile)
    if (basicFieldsSet && hasUnlinkedReferences) {
      return {
        profileId: profile.getId(),
        isValid: false,
        state: ProfileStateType.BasicFieldsSetButReferenceNotSet,
        referenceFieldId: referenceFieldId,
      }
    }

    if (basicFieldsSet) {
      return {
        profileId: profile.getId(),
        isValid: true,
        state: ProfileStateType.BasicFieldsSetAndReferenceSet,
      }
    }

    if (referenceFieldsSet) {
      return {
        profileId: profile.getId(),
        isValid: true,
        state: ProfileStateType.NoBasicFieldsSetButReferencesSet,
      }
    }

    return {
      profileId: profile.getId(),
      isValid: false,
      state: ProfileStateType.NoBasicFieldsSetAndNoReferencesSet,
      referenceFieldId: referenceFieldId,
    }
  }

  /**
   * Returns the IDs of unlinked reference fields for a given profile.
   * @param {DataSelectionProfile} profile
   * @returns {string}
   */
  private getUnlinkedReferenceFieldId(profile: DataSelectionProfile): string {
    return profile
      .getProfileFields()
      .getUnlinkedRequiredOrRecommendedReferences()
      .map((field) => field.getElementId())[0]
  }
}
