import { Injectable, inject } from '@angular/core'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter'
import { ProfileTimeRestrictionFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileDateFilter'
import { AttributeGroupsData } from 'src/app/model/Interface/AttributeGroupsData'
import { FilterData } from 'src/app/model/Interface/FilterData'
import { DataSelectionFilterType } from 'src/app/model/Utilities/DataSelectionFilterType'
import { TypeGuard } from '../../TypeGuard/TypeGuard'
import { UITimeRestrictionFactoryService } from '../Shared/UITimeRestrictionFactory.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileDateFilterTranslatorService {
  private readonly uITimeRestrictionFactoryService = inject(UITimeRestrictionFactoryService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Creates the time restriction filters of the profile from the extracted group.
   * @param {AttributeGroupsData} externProfile
   * @param {DataSelectionProfile} profile
   * @returns {ProfileTimeRestrictionFilter[]}
   */
  public createDateFilters(externProfile: AttributeGroupsData, profile: DataSelectionProfile): ProfileTimeRestrictionFilter[] {
    return (profile.getFilters() ?? [])
      .filter((filterData: AbstractProfileFilter) => filterData.getType() === DataSelectionFilterType.DATE)
      .map((filterData: AbstractProfileFilter) =>
        this.createProfileTimeRestrictionFilter(filterData as ProfileTimeRestrictionFilter, externProfile)
      )
  }

  /**
   * Creates a time restriction filter with the dates found in the extracted group.
   * @param {ProfileTimeRestrictionFilter} filterData
   * @param {AttributeGroupsData} externProfile
   * @returns {ProfileTimeRestrictionFilter}
   */
  private createProfileTimeRestrictionFilter(
    filterData: ProfileTimeRestrictionFilter,
    externProfile: AttributeGroupsData
  ): ProfileTimeRestrictionFilter {
    const foundFilter = externProfile.filter.find((externFilter: FilterData) => externFilter.name === filterData.getName())
    if (foundFilter && TypeGuard.isFilterData(foundFilter)) {
      const timeRestriction = this.uITimeRestrictionFactoryService.createTimeRestrictionForDataSelection(foundFilter)
      return new ProfileTimeRestrictionFilter(foundFilter.name, foundFilter.type, timeRestriction)
    } else {
      return filterData
    }
  }
}
