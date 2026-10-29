import { inject, Injectable } from '@angular/core'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { ProfileFields } from 'src/app/model/DataSelection/Profile/Fields/ProfileFields'
import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter'
import { ProfileReference } from 'src/app/model/DataSelection/Profile/Reference/ProfileReference'
import { DataSelectionProfileData } from 'src/app/model/Interface/DataSelectionProfileData'
import { v4 as uuidv4 } from 'uuid'
import { ProfileFieldBuilderService } from './ProfileFieldBuilder.service'
import { ProfileFilterBuilderService } from './ProfileFilterBuilder.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileInstanceBuilderService {
  private readonly profileFilterBuilder = inject(ProfileFilterBuilderService)
  private readonly profileFieldBuilder = inject(ProfileFieldBuilderService)

  constructor() {}

  public buildProfileInstances(item: DataSelectionProfileData[], markAsReference: boolean): DataSelectionProfile[] {
    return item.map((profile: DataSelectionProfileData) => this.buildProfileInstance(profile, markAsReference))
  }

  private buildProfileInstance(item: DataSelectionProfileData, markAsReference: boolean): DataSelectionProfile {
    const filters = this.profileFilterBuilder.buildFilters(item.filters)
    const fields = this.profileFieldBuilder.buildProfileFields(item.fields, item.references)
    return this.buildProfile(item, fields, filters, markAsReference)
  }

  /**
   * Constructs a DataSelectionProfile instance from raw API data and pre-built fields/filters.
   * @param {DataSelectionProfileData} item Raw profile data from the API response.
   * @param {ProfileFields} fields Pre-built ProfileFields instance.
   * @param {AbstractProfileFilter[]} filters Pre-built array of AbstractProfileFilter instances.
   * @param {boolean} markAsReference Whether this profile should be marked as a reference.
   * @returns {DataSelectionProfile} A fully constructed DataSelectionProfile instance.
   */
  private buildProfile(
    item: DataSelectionProfileData,
    fields: ProfileFields,
    filters: AbstractProfileFilter[],
    markAsReference: boolean
  ): DataSelectionProfile {
    const displayInstance = Display.fromJson(item.display)
    return new DataSelectionProfile(
      uuidv4(),
      item.url,
      displayInstance,
      fields,
      filters,
      new ProfileReference(markAsReference, markAsReference),
      displayInstance,
      0
    )
  }
}
