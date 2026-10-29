import { Injectable } from '@angular/core'
import { AfterFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AfterFilter'
import { AtFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AtFilter'
import { BeforeFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/BeforeFilter'
import { BetweenFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/BetweenFilter'
import { TimeRestrictionType } from 'src/app/model/FeasibilityQuery/TimeRestriction'

@Injectable({
  providedIn: 'root',
})
export class TimeRestrictionFactoryService {
  constructor() {}

  /**
   * Creates and returns the appropriate time restriction filter based on the provided type and dates.
   *
   * @param {string} afterDate The start date for the restriction.
   * @param {TimeRestrictionType} timeRestrictionType The type of time restriction (AFTER, AT, BEFORE, BETWEEN).
   * @param {string} beforeDate (Optional) The end date for the restriction, required for the BETWEEN filter.
   * @returns {BetweenFilter | AfterFilter | AtFilter | BeforeFilter} The created filter instance or null if no valid filter is created.
   */
  public createTimeRestrictionFilter(timeRestrictionType: TimeRestrictionType, afterDate: string, beforeDate?: string) {
    switch (timeRestrictionType) {
      case TimeRestrictionType.AFTER:
        return new AfterFilter(afterDate)

      case TimeRestrictionType.AT:
        return new AtFilter(afterDate, afterDate)

      case TimeRestrictionType.BEFORE:
        return new BeforeFilter(afterDate)

      case TimeRestrictionType.BETWEEN:
        if (beforeDate) {
          return new BetweenFilter(afterDate, beforeDate)
        }
        console.error('Before date is required for BETWEEN filter.')
        return null

      default:
        console.error('Unsupported TimeRestrictionType:', timeRestrictionType)
        return null
    }
  }
}
