import { AbstractProfileFilter } from '../../DataSelection/Profile/Filter/AbstractProfileFilter'
import { ProfileTimeRestrictionFilter } from '../../DataSelection/Profile/Filter/ProfileDateFilter'
import { ProfileTokenFilter } from '../../DataSelection/Profile/Filter/ProfileTokenFilter'
import { CloneTimeRestriction } from '../CriterionCloner/TimeRestriction/CloneTimeRestriction'
import { TokenFilterCloner } from './TokenFilterCloner'

export class ProfileFilterCloner {
  /**
   * Clones an array of filters deeply.
   * @param {AbstractProfileFilter[]} filters The array of filters to clone.
   * @returns {(ProfileTimeRestrictionFilter | ProfileTokenFilter)[]} A deep copy of the filters array.
   */
  public static deepCopyFilters(filters: AbstractProfileFilter[]): (ProfileTimeRestrictionFilter | ProfileTokenFilter)[] {
    if (!filters || filters.length === 0) {
      return []
    }
    return filters.map((filter: AbstractProfileFilter) => this.deepCopyProfileFilter(filter))
  }

  public static deepCopyProfileFilter(filter: AbstractProfileFilter) {
    if (filter instanceof ProfileTimeRestrictionFilter) {
      return ProfileFilterCloner.deepCopyProfileTimeRestrictionFilter(filter)
    } else if (filter instanceof ProfileTokenFilter) {
      return ProfileFilterCloner.deepCopyProfileTokenFilter(filter)
    } else {
      throw new Error(`Unsupported filter type: ${filter.constructor.name}`)
    }
  }
  /**
   * Clones a ProfileTimeRestrictionFilter object deeply.
   * @param {ProfileTimeRestrictionFilter} filter The ProfileTimeRestrictionFilter to clone.
   * @returns {ProfileTimeRestrictionFilter} A deep copy of the ProfileTimeRestrictionFilter.
   */
  public static deepCopyProfileTimeRestrictionFilter(filter: ProfileTimeRestrictionFilter): ProfileTimeRestrictionFilter {
    if (!filter) {
      return undefined
    }
    return new ProfileTimeRestrictionFilter(
      filter.getName(),
      filter.getType(),
      CloneTimeRestriction.deepCopyTimeRestriction(filter.getTimeRestriction()) // Corrected method call
    )
  }

  /**
   * Clones a ProfileTokenFilter object deeply.
   * @param {ProfileTokenFilter} filter The ProfileTokenFilter to clone.
   * @returns {ProfileTokenFilter} A deep copy of the ProfileTokenFilter.
   */
  public static deepCopyProfileTokenFilter(filter: ProfileTokenFilter): ProfileTokenFilter {
    if (!filter) {
      return undefined
    }
    return TokenFilterCloner.deepCopyTokenFilter(filter)
  }
}
