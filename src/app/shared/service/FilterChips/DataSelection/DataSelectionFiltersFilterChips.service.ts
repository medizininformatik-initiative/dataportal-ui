import { Injectable } from '@angular/core';
import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter';
import { ProfileTimeRestrictionFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileDateFilter';
import { DataSelectionUIType } from 'src/app/model/Utilities/DataSelectionUIType';
import { TimeRestrictionChipService } from '../Criterion/TimeRestrictionChip.service';
import { InterfaceFilterChip } from 'src/app/shared/models/FilterChips/InterfaceFilterChip';
import { FilterChipConceptAdapter } from 'src/app/shared/models/FilterChips/Adapter/FilterChipConceptAdapter';
import { ProfileTokenFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileTokenFilter';

@Injectable({
  providedIn: 'root',
})
export class DataSelectionFiltersFilterChips {
  constructor(private timeRestrictionFilterChipsService: TimeRestrictionChipService) {}

  public generateFilterChipsForDataSelectionFilters(
    filters: AbstractProfileFilter[]
  ): InterfaceFilterChip[] {
    return filters.reduce<InterfaceFilterChip[]>((filterChips, filter) => {
      filterChips.push(...this.getChipsForFilter(filter));
      return filterChips;
    }, []);
  }

  private getChipsForFilter(filter: AbstractProfileFilter): InterfaceFilterChip[] {
    switch (filter.getUiType()) {
      case DataSelectionUIType.TIMERESTRICTION:
        return this.getTimeRestrictionChips(filter as ProfileTimeRestrictionFilter);
      case DataSelectionUIType.CODE:
        return this.getCodeFilterChips(filter as ProfileTokenFilter);
      default:
        return [];
    }
  }

  private getTimeRestrictionChips(filter: ProfileTimeRestrictionFilter): InterfaceFilterChip[] {
    return this.timeRestrictionFilterChipsService.generateTimeRestrictionChips(
      filter.getTimeRestriction()
    );
  }

  private getCodeFilterChips(filter: ProfileTokenFilter): InterfaceFilterChip[] {
    return FilterChipConceptAdapter.adaptCodeableConcept(
      filter.getSelectedTokens(),
      'EDITOR.CONTENT.PROFILE.TAB_LABEL.' + filter.getType().toUpperCase()
    );
  }
}
