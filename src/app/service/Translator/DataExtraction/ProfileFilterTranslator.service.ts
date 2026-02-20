import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter';
import { AttributeGroupsData } from 'src/app/model/Interface/AttributeGroupsData';
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept';
import { DataSelectionFilterType } from 'src/app/model/Utilities/DataSelectionFilterType';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { Injectable } from '@angular/core';
import { ProfileTimeRestrictionFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileDateFilter';
import { ProfileTokenFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileTokenFilter';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { TypeGuard } from '../../TypeGuard/TypeGuard';
import { UITimeRestrictionFactoryService } from '../Shared/UITimeRestrictionFactory.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ProfileFilterTranslatorService {
  constructor(private uITimeRestrictionFactoryService: UITimeRestrictionFactoryService) {}

  public createProfileFilters(
    externProfile: AttributeGroupsData,
    profile: DataSelectionProfile
  ): AbstractProfileFilter[] {
    const filters: AbstractProfileFilter[] = [];
    const tokenFilters = this.createTokenFilters(externProfile, profile);
    const dateFilters = this.createDateFilters(externProfile, profile);
    filters.push(...tokenFilters);
    filters.push(...dateFilters);
    return filters;
  }

  private createTokenFilters(
    externProfile: AttributeGroupsData,
    profile: DataSelectionProfile
  ): ProfileTokenFilter[] {
    return (profile.getFilters() ?? [])
      .filter(
        (filterData: AbstractProfileFilter) =>
          filterData.getType() === DataSelectionFilterType.TOKEN
      )
      .map((filterData) =>
        this.createProfileTokenFilter(filterData as ProfileTokenFilter, externProfile)
      );
  }

  private createDateFilters(
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

  private createProfileTokenFilter(
    filterData: ProfileTokenFilter,
    externProfile: AttributeGroupsData
  ): ProfileTokenFilter {
    const foundFilter = externProfile.filter.find(
      (externFilter) => externFilter.name === filterData.getName()
    );
    if (foundFilter && TypeGuard.isFilterData(foundFilter)) {
      const concepts = foundFilter.codes.map(
        (code) =>
          new Concept(
            new Display([], code.display),
            new TerminologyCode(code.code, code.display, code.system, code.version)
          )
      );
      return new ProfileTokenFilter(
        uuidv4(),
        foundFilter.name,
        foundFilter.type,
        filterData.getValueSetUrls(),
        concepts
      );
    } else {
      return filterData;
    }
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
