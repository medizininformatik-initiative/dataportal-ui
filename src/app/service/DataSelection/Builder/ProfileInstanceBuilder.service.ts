import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProfileData } from 'src/app/model/Interface/DataSelectionProfileData'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { inject, Injectable } from '@angular/core'
import { ProfileFieldBuilderService } from './ProfileFieldBuilder.service'
import { ProfileFields } from 'src/app/model/DataSelection/Profile/Fields/ProfileFields'
import { ProfileFilterBuilderService } from './ProfileFilterBuilder.service'
import { ProfileReference } from 'src/app/model/DataSelection/Profile/Reference/ProfileReference'
import { v4 as uuidv4 } from 'uuid'

@Injectable({
  providedIn: 'root',
})
export class ProfileInstanceBuilderService {
  private profileFilterBuilder = inject(ProfileFilterBuilderService)
  private profileFieldBuilder = inject(ProfileFieldBuilderService)

  constructor() {}

  public buildProfileInstances(
    item: DataSelectionProfileData[],
    markAsReference: boolean
  ): DataSelectionProfile[] {
    return item.map((profile: DataSelectionProfileData) =>
      this.buildProfileInstance(profile, markAsReference)
    )
  }

  private buildProfileInstance(
    item: DataSelectionProfileData,
    markAsReference: boolean
  ): DataSelectionProfile {
    const filters = this.profileFilterBuilder.buildFilters(item.filters)
    const fields = this.profileFieldBuilder.buildProfileFields(item.fields, item.references)
    return this.buildProfile(item, fields, filters, markAsReference)
  }

  /**
   * Constructs a DataSelectionProfile instance from raw API data and pre-built fields/filters.
   * @param item Raw profile data from the API response.
   * @param fields Pre-built ProfileFields instance.
   * @param filters Pre-built array of AbstractProfileFilter instances.
   * @param markAsReference Whether this profile should be marked as a reference.
   * @returns A fully constructed DataSelectionProfile instance.
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
