import { Injectable } from '@angular/core'
import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter'
import { ProfileTimeRestrictionFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileDateFilter'
import { ProfileTokenFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileTokenFilter'
import { BetweenFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/BetweenFilter'
import { ProfileFilterData } from 'src/app/model/Interface/ProfileFilterData'
import { DataSelectionUIType } from 'src/app/model/Utilities/DataSelectionUIType'
import { v4 as uuidv4 } from 'uuid'

@Injectable({
  providedIn: 'root',
})
export class ProfileFilterBuilderService {
  /**
   * Creates an array of AbstractProfileFilter instances from raw filter data.
   * @param {ProfileFilterData[]} filters Raw filter data from the API response.
   * @returns {AbstractProfileFilter[]} Array of typed profile filter instances.
   */
  public buildFilters(filters: ProfileFilterData[]): AbstractProfileFilter[] {
    if (!filters || filters.length === 0) {
      return []
    } else {
      return filters.map((filter: ProfileFilterData) => this.buildFilter(filter))
    }
  }

  private buildFilter(filter: ProfileFilterData): AbstractProfileFilter {
    const uiType = filter.ui_type
    switch (uiType) {
      case DataSelectionUIType.TIMERESTRICTION:
        return this.buildTimeRestrictionFilter(filter)
      case DataSelectionUIType.CODE:
        return this.buildTokenFilter(filter)
      default:
        throw new Error(`Unsupported filter type: ${filter.ui_type}`)
    }
  }

  /**
   * Constructs a ProfileTimeRestrictionFilter from raw filter data.
   * @param {ProfileFilterData} filter Raw filter data entry.
   * @returns {ProfileTimeRestrictionFilter} A ProfileTimeRestrictionFilter instance.
   */
  private buildTimeRestrictionFilter(filter: ProfileFilterData): ProfileTimeRestrictionFilter {
    return new ProfileTimeRestrictionFilter(filter.name, filter.type, new BetweenFilter(null, null))
  }

  private buildTokenFilter(filter: ProfileFilterData): ProfileTokenFilter {
    return new ProfileTokenFilter(uuidv4(), filter.name, filter.type, filter.valueSetUrls, [])
  }
}
