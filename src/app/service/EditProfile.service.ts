import { AbstractProfileFilter } from '../model/DataSelection/Profile/Filter/AbstractProfileFilter';
import { AbstractTimeRestriction } from '../model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction';
import { CloneTimeRestriction } from '../model/Utilities/CriterionCloner/TimeRestriction/CloneTimeRestriction';
import { DataSelectionProfile } from '../model/DataSelection/Profile/DataSelectionProfile';
import { DataSelectionProfileCloner } from '../model/Utilities/DataSelecionCloner/DataSelectionProfileCloner';
import { Injectable } from '@angular/core';
import { ProfileTimeRestrictionFilter } from '../model/DataSelection/Profile/Filter/ProfileDateFilter';
import { ProfileTokenFilter } from '../model/DataSelection/Profile/Filter/ProfileTokenFilter';

@Injectable({
  providedIn: 'root',
})
export class EditProfileService {
  constructor() {}

  /**
   * Updates the time restriction filter in the given profile.
   * @param profile The profile to update.
   * @param timeRestriction The new time restriction to apply.
   * @param filterName The name of the filter to update.
   * @returns
   */
  public updateTimeRestriction(
    profile: DataSelectionProfile,
    timeRestriction: AbstractTimeRestriction,
    filterName: string
  ): void {
    const index = this.getTimeRestrictionFilter(profile).findIndex(
      (filter) => filter.getName() === filterName
    );
    if (index !== -1) {
      profile.getFilters()[index] = this.createProfileTimeRestriction(
        profile.getFilters()[index] as ProfileTimeRestrictionFilter,
        timeRestriction
      );
    }
  }

  /**
   * Finds the index of the time restriction filter in the profile.
   * @param profile The profile to search.
   * @returns The index of the time restriction filter, or -1 if not found.
   */
  public getTimeRestrictionFilterIndex(profile: DataSelectionProfile): number {
    return profile.getFilters().findIndex((filter) => filter.getType() === 'date');
  }

  /**
   * Gets all time restriction filters in the profile.
   * @param profile The profile to search.
   * @returns An array of time restriction filters.
   */
  public getTimeRestrictionFilter(profile: DataSelectionProfile): AbstractProfileFilter[] {
    return profile.getFilters().filter((filter) => filter.getType() === 'date');
  }

  /**
   * Creates a new ProfileTimeRestrictionFilter with the given time restriction.
   * @param filter The existing filter to update.
   * @param timeRestriction The new time restriction to apply.
   * @returns A new ProfileTimeRestrictionFilter instance.
   */
  private createProfileTimeRestriction(
    filter: ProfileTimeRestrictionFilter,
    timeRestriction: AbstractTimeRestriction
  ): ProfileTimeRestrictionFilter {
    return new ProfileTimeRestrictionFilter(
      filter.getName(),
      filter.getType(),
      CloneTimeRestriction.deepCopyTimeRestriction(timeRestriction)
    );
  }

  /**
   * Gets all token filters in the profile.
   * @param profile The profile to search.
   * @returns An array of token filters.
   */
  public getProfileTokenFilter(profile: DataSelectionProfile): AbstractProfileFilter[] {
    return profile.getFilters().filter((filter) => filter.getType() === 'token');
  }

  /**
   * Updates the token filter in the given profile.
   * @param profile The profile to update.
   * @param tokenFilter The new token filter to apply.
   * @returns
   */
  public updateProfileTokenFilter(
    profile: DataSelectionProfile,
    tokenFilter: ProfileTokenFilter
  ): void {
    const index = this.getProfileTokenFilterIndex(profile);
    if (index !== -1) {
      profile.getFilters()[index] = tokenFilter;
    }
  }

  /**
   * Finds the index of the token filter in the profile.
   * @param profile The profile to search.
   * @returns The index of the token filter, or -1 if not found.
   */
  public getProfileTokenFilterIndex(profile: DataSelectionProfile): number {
    return profile.getFilters().findIndex((filter) => filter.getType() === 'token');
  }

  /**
   * Creates a new instance of the given profile.
   * @param profile The profile to copy.
   * @returns A new instance of the profile.
   */
  public createNewProfileInstance(profile: DataSelectionProfile): DataSelectionProfile {
    return DataSelectionProfileCloner.deepCopyProfile(profile);
  }
}
