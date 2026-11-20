import { Injectable, inject } from '@angular/core'
import { DataSelectionProviderService } from './Provider/DataSelectionProvider.service'
import { take } from 'rxjs'
import { DataSelectionProfile } from '../model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProfileCloner } from '../model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'

@Injectable({
  providedIn: 'root',
})
export class RemoveReferenceService {
  private dataSelectionProviderService = inject(DataSelectionProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public delete(profileIdToBeDeleted: string): void {
    this.dataSelectionProviderService
      .getActiveDataSelection()
      .pipe(take(1))
      .subscribe((dataSelection) => {
        const profiles = dataSelection.getProfiles()
        const unlinkedIds =
          profiles
            .find((profile) => profile.getId() === profileIdToBeDeleted)
            ?.getProfileFields()
            .getLinkedProfileIds() ?? []
        profiles
          .filter((profile) => profile.getId() !== profileIdToBeDeleted)
          .forEach((profile) =>
            this.dataSelectionProviderService.setActiveProfile(
              this.removeReferenceFromProfile(profile, profileIdToBeDeleted)
            )
          )
        this.dataSelectionProviderService.removeProfileFromDataSelection(
          dataSelection.getId(),
          profileIdToBeDeleted
        )
        this.dataSelectionProviderService.resetUnlinkedReferences(unlinkedIds)
      })
  }

  public removeReferenceFromProfile(
    profile: DataSelectionProfile,
    profileIdToBeDeleted: string
  ): DataSelectionProfile {
    const clonedProfile = DataSelectionProfileCloner.deepCopyProfile(profile)
    const selectedReferenceFields = clonedProfile.getProfileFields().getSelectedReferenceFields()

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

    return clonedProfile
  }
}
