import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter';
import { AttributeGroupsData } from 'src/app/model/Interface/AttributeGroupsData';
import { DataSelectionFilterType } from 'src/app/model/Utilities/DataSelectionFilterType';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { Injectable } from '@angular/core';
import { ProfileTimeRestrictionFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileDateFilter';
import { TypeGuard } from '../../TypeGuard/TypeGuard';
import { UITimeRestrictionFactoryService } from '../Shared/UITimeRestrictionFactory.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileDateFilterTranslatorService {
  constructor(private uITimeRestrictionFactoryService: UITimeRestrictionFactoryService) {}

  public createDateFilters(
    externProfile: AttributeGroupsData,
    profile: DataSelectionProfile
  ): ProfileTimeRestrictionFilter[] {
    return (profile.getFilters() ?? [])
      .filter(
        (filterData: AbstractProfileFilter) => filterData.getType() === DataSelectionFilterType.DATE
      )
      .map((filterData) =>
        this.createProfileTimeRestrictionFilter(
          filterData as ProfileTimeRestrictionFilter,
          externProfile
        )
      );
  }

  private createProfileTimeRestrictionFilter(
    filterData: ProfileTimeRestrictionFilter,
    externProfile: AttributeGroupsData
  ): ProfileTimeRestrictionFilter {
    const foundFilter = externProfile.filter.find(
      (externFilter) => externFilter.name === filterData.getName()
    );
    if (foundFilter && TypeGuard.isFilterData(foundFilter)) {
      const timeRestriction =
        this.uITimeRestrictionFactoryService.createTimeRestrictionForDataSelection(foundFilter);
      return new ProfileTimeRestrictionFilter(foundFilter.name, foundFilter.type, timeRestriction);
    } else {
      return filterData;
    }
  }
}
