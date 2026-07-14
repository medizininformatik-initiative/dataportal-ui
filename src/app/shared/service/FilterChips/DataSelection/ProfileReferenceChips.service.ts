import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { FilterChipProfileRefrenceAdapter } from 'src/app/shared/models/FilterChips/Adapter/DataSelection/FilterChipProfileRefrenceAdapter'
import { Injectable, inject } from '@angular/core'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import {
  ProfileReferenceChipData,
  ProfileReferenceGroup,
} from 'src/app/shared/models/FilterChips/ProfileReferenceChipData'

@Injectable({
  providedIn: 'root',
})
export class ProfileReferenceChipsService {
  private profileProviderService = inject(ProfileProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public getProfileReferenceChips(
    selectedReferenceFields: SelectedReferenceField
  ): ProfileReferenceChipData {
    const referenceGroup = this.getProfileReferenceGroup(selectedReferenceFields)
    return this.adaptToProfileReferenceChipData(referenceGroup)
  }

  private getProfileReferenceGroup(
    selectedReferenceFields: SelectedReferenceField
  ): ProfileReferenceGroup {
    const displays = this.getLinkedProfileDisplays(selectedReferenceFields)
    const referenceGroup: ProfileReferenceGroup = {
      elementId: selectedReferenceFields.getElementId(),
      profiles: displays,
    }
    return referenceGroup
  }

  private getLinkedProfileDisplays(selectedReferenceField: SelectedReferenceField): Display[] {
    return selectedReferenceField
      .getLinkedProfileIds()
      .map((id) => {
        try {
          return this.profileProviderService.getOne(id).getLabel()
        } catch {
          return undefined
        }
      })
      .filter((profileDisplay): profileDisplay is Display => !!profileDisplay)
  }

  private adaptToProfileReferenceChipData(groups: ProfileReferenceGroup): ProfileReferenceChipData {
    return FilterChipProfileRefrenceAdapter.adaptToProfileReferenceChipData(groups)
  }
}
