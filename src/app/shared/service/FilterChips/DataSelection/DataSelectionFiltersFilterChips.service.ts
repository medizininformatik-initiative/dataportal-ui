import { Injectable, inject } from '@angular/core'
import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter'
import { ProfileTimeRestrictionFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileDateFilter'
import { ProfileTokenFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileTokenFilter'
import { DataSelectionUIType } from 'src/app/model/Utilities/DataSelectionUIType'
import { FilterChipConceptAdapter } from 'src/app/shared/models/FilterChips/Adapter/FilterChipConceptAdapter'
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData'
import { TimeRestrictionChipService } from '../Criterion/TimeRestrictionChip.service'

@Injectable({
  providedIn: 'root',
})
export class DataSelectionFiltersFilterChips {
  private readonly timeRestrictionFilterChipsService = inject(TimeRestrictionChipService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Generates the chips of all profile filters.
   * @param {AbstractProfileFilter[]} filters
   * @returns {FilterChipData[]}
   */
  public generateFilterChipsForDataSelectionFilters(filters: AbstractProfileFilter[]): FilterChipData[] {
    return filters.reduce<FilterChipData[]>((filterChips: FilterChipData[], filter: AbstractProfileFilter) => {
      filterChips.push(...this.getChipsForFilter(filter))
      return filterChips
    }, [])
  }

  /**
   * Generates the chips that match the UI type of the filter.
   * @param {AbstractProfileFilter} filter
   * @returns {FilterChipData[]}
   */
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

  /**
   * Generates the chips of a time restriction filter.
   * @param {ProfileTimeRestrictionFilter} filter
   * @returns {FilterChipData[]}
   */
  private getTimeRestrictionChips(filter: ProfileTimeRestrictionFilter): FilterChipData[] {
    return this.timeRestrictionFilterChipsService.generateTimeRestrictionChips(filter.getTimeRestriction())
  }

  /**
   * Generates the chips of a token filter.
   * @param {ProfileTokenFilter} filter
   * @returns {FilterChipData[]}
   */
  private getCodeFilterChips(filter: ProfileTokenFilter): FilterChipData[] {
    return FilterChipConceptAdapter.adaptCodeableConcept(
      filter.getSelectedTokens(),
      'EDITOR.CONTENT.TAB_LABEL.' + filter.getType().toUpperCase()
    )
  }
}
