import { Injectable, inject } from '@angular/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { FilterChipProfileRefrenceAdapter } from 'src/app/shared/models/FilterChips/Adapter/DataSelection/FilterChipProfileRefrenceAdapter'
import { ProfileReferenceChipData, ProfileReferenceGroup } from 'src/app/shared/models/FilterChips/ProfileReferenceChipData'

@Injectable({
  providedIn: 'root',
})
export class ProfileReferenceChipsService {
  private readonly profileProviderService = inject(ProfileProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Returns the chip data of the selected reference field.
   * @param {SelectedReferenceField} selectedReferenceFields
   * @returns {ProfileReferenceChipData}
   */
  public getProfileReferenceChips(selectedReferenceFields: SelectedReferenceField): ProfileReferenceChipData {
    const referenceGroup = this.getProfileReferenceGroup(selectedReferenceFields)
    return this.adaptToProfileReferenceChipData(referenceGroup)
  }

  /**
   * Groups the displays of the linked profiles of the reference field.
   * @param {SelectedReferenceField} selectedReferenceFields
   * @returns {ProfileReferenceGroup}
   */
  private getProfileReferenceGroup(selectedReferenceFields: SelectedReferenceField): ProfileReferenceGroup {
    const displays = this.getLinkedProfileDisplays(selectedReferenceFields)
    const referenceGroup: ProfileReferenceGroup = {
      elementId: selectedReferenceFields.getElementId(),
      profiles: displays,
    }
    return referenceGroup
  }

  /**
   * Returns the linked profile displays.
   *
   * @param {SelectedReferenceField} selectedReferenceField
   * @returns {{ display: Display; number: number }[]}
   */
  private getLinkedProfileDisplays(selectedReferenceField: SelectedReferenceField): { display: Display; number: number }[] {
    return selectedReferenceField
      .getLinkedProfileIds()
      .map((id: string) => ({
        display: this.profileProviderService.getOne(id).getLabel(),
        number: this.profileProviderService.getOne(id).getLabelNumber(),
      }))

      .filter((profileDisplay): profileDisplay is { display: Display; number: number } => !!profileDisplay.display)
  }

  /**
   * Adapts the group to chip data.
   * @param {ProfileReferenceGroup} groups
   * @returns {ProfileReferenceChipData}
   */
  private adaptToProfileReferenceChipData(groups: ProfileReferenceGroup): ProfileReferenceChipData {
    return FilterChipProfileRefrenceAdapter.adaptToProfileReferenceChipData(groups)
  }
}
