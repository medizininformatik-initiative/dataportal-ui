import { DataSelectionProfileCloner } from 'src/app/model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { inject, Injectable } from '@angular/core'
import { NavigationHelperService } from '../../../../service/NavigationHelper.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { RemoveReferenceService } from '../../../../service/RemoveReference.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileReferenceMenuFunctionsService {
  private profileProviderService = inject(ProfileProviderService)
  private navigationHelperService = inject(NavigationHelperService)
  private dataSelectionProviderService = inject(DataSelectionProviderService)

  constructor() {}

  public navigate(id: string, args?: Record<string, unknown>) {
    const elementId = args?.elementId as string | undefined
    const state = elementId ? { activeTab: elementId } : undefined
    this.navigationHelperService.navigateToEditProfile(id, state)
  }

  public delete(profileId: string, elementId: string): void {
    const profile = this.profileProviderService.getOne(profileId)

    const referenceFields = profile.getProfileFields().getReferenceFields()

    const foundField = referenceFields.find((field) => field.getElementId() === elementId)

    if (foundField) {
      foundField.setRecommended(false)
    }

    const selectedReferences = profile.getProfileFields().getSelectedReferenceFields()

    const index = selectedReferences.findIndex((field) => field.getElementId() === elementId)

    if (index !== -1) {
      selectedReferences.splice(index, 1)
    }
    const updatedProfile = DataSelectionProfileCloner.deepCopyProfile(profile)
    this.profileProviderService.addOne(updatedProfile)
    this.dataSelectionProviderService.setProfileInActiveDataSelection(updatedProfile)
  }
}
