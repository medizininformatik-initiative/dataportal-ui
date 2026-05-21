import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter'
import { DataSelectionUIType } from 'src/app/model/Utilities/DataSelectionUIType'
import { FilterChipConceptAdapter } from 'src/app/shared/models/FilterChips/Adapter/FilterChipConceptAdapter'
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData'
import { Injectable } from '@angular/core'
import { ProfileTimeRestrictionFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileDateFilter'
import { ProfileTokenFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileTokenFilter'
import { TimeRestrictionChipService } from '../Criterion/TimeRestrictionChip.service'

@Injectable({
  providedIn: 'root',
})
export class DataSelectionFiltersFilterChips {
  constructor(private timeRestrictionFilterChipsService: TimeRestrictionChipService) {}

  public generateFilterChipsForDataSelectionFilters(
    filters: AbstractProfileFilter[]
  ): FilterChipData[] {
    return filters.reduce<FilterChipData[]>((filterChips, filter) => {
      filterChips.push(...this.getChipsForFilter(filter))
      return filterChips
    }, [])
  }

  private getChipsForFilter(filter: AbstractProfileFilter): FilterChipData[] {
    switch (filter.getUiType()) {
      case DataSelectionUIType.TIMERESTRICTION:
        return this.getTimeRestrictionChips(filter as ProfileTimeRestrictionFilter)
      case DataSelectionUIType.CODE:
        return this.getCodeFilterChips(filter as ProfileTokenFilter)
      default:
        return []
    }
  }

  private getTimeRestrictionChips(filter: ProfileTimeRestrictionFilter): FilterChipData[] {
    return this.timeRestrictionFilterChipsService.generateTimeRestrictionChips(
      filter.getTimeRestriction()
    )
  }

  private getCodeFilterChips(filter: ProfileTokenFilter): FilterChipData[] {
    return FilterChipConceptAdapter.adaptCodeableConcept(
      filter.getSelectedTokens(),
      'EDITOR.CONTENT.TAB_LABEL.' + filter.getType().toUpperCase()
    )
  }
}
