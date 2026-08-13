import { Injectable, inject } from '@angular/core'
import { DataSelectionProviderService } from './Provider/DataSelectionProvider.service'
import { ProfileProviderService } from './Provider/ProfileProvider.service'
import { map, take } from 'rxjs'
import { DataSelectionProfile } from '../model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProfileCloner } from '../model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'

@Injectable({
  providedIn: 'root',
})
export class RemoveReferenceService {
  private dataSelectionProviderService = inject(DataSelectionProviderService)
  private profileProviderService = inject(ProfileProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public delete(profileIdToBeDeleted: string): void {
    this.dataSelectionProviderService
      .getActiveDataSelection()
      .pipe(
        take(1),
        map((dataSelection) => {
          dataSelection.getProfiles().map((profile) => {
            const updatedProfile = this.removeReferenceFromProfile(profile, profileIdToBeDeleted)
            this.dataSelectionProviderService.setProfileInActiveDataSelection(updatedProfile, 'SET')
          })
          //this.profileProviderService.removeProfileById(profileIdToBeDeleted);
          return dataSelection
        })
      )
      .subscribe((dataSelection) =>
        this.dataSelectionProviderService.removeProfileFromDataSelection(
          dataSelection.getId(),
          profileIdToBeDeleted
        )
      )
  }

  public removeReferenceFromProfile(
    profile: DataSelectionProfile,
    profileIdToBeDeleted: string
  ): DataSelectionProfile {
    const selectedReferenceFields = profile.getProfileFields().getSelectedReferenceFields()

    for (let i = selectedReferenceFields.length - 1; i >= 0; i--) {
      const field = selectedReferenceFields[i]
      const linkedProfileIds = field
        .getLinkedProfileIds()
        .filter((id) => id !== profileIdToBeDeleted)
      field.setLinkedProfileIds(linkedProfileIds)

      // Remove the field if no linked profiles remain
      if (linkedProfileIds.length === 0) {
        selectedReferenceFields.splice(i, 1)
      }
    }

    return DataSelectionProfileCloner.deepCopyProfile(profile)
  }
}
