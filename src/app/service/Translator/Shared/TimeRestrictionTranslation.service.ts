import { Injectable } from '@angular/core'
import { AbstractTimeRestriction as FQAbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { TimeRestrictionType } from 'src/app/model/FeasibilityQuery/TimeRestriction'
import { AfterFilter } from 'src/app/model/StructuredQuery/Criterion/TimeRestriction/AfterFilter'
import { AtFilter } from 'src/app/model/StructuredQuery/Criterion/TimeRestriction/AtFilter'
import { BeforeFilter } from 'src/app/model/StructuredQuery/Criterion/TimeRestriction/BeforeFilter'
import { BetweenFilter } from 'src/app/model/StructuredQuery/Criterion/TimeRestriction/BetweenFilter'
import { AbstractTimeRestriction as SQAbstractTimeRestriction } from '../../../model/StructuredQuery/Criterion/TimeRestriction/AbstractTimeRestriction'

@Injectable({
  providedIn: 'root',
})
export class TimeRestrictionTranslationService {
  /**
   * Translates a Criterion's time restriction into a structured query.
   *
   * @param criterion The criterion containing the time restriction.
   * @param timeRestriction
   * @returns The corresponding time restriction filter.
   */
  public translateTimeRestrictionToStructuredQuery(timeRestriction: FQAbstractTimeRestriction): SQAbstractTimeRestriction | undefined {
    if (timeRestriction && timeRestriction.getAfterDate()) {
      const startDate = new Date(timeRestriction.getAfterDate())
      const endDate = new Date(timeRestriction.getBeforeDate())
      const offset = startDate.getTimezoneOffset() / -60

      startDate.setHours(23 + offset, 59, 59, 999)
      endDate.setHours(offset, 0, 0, 0)

      switch (timeRestriction.getType()) {
        case TimeRestrictionType.AFTER:
          return this.createAfterFilter(startDate)
        case TimeRestrictionType.AT:
          return this.createAtFilter(startDate)
        case TimeRestrictionType.BEFORE:
          return this.createBeforeFilter(startDate)
        case TimeRestrictionType.BETWEEN:
          return this.createBetweenFilter(startDate, endDate)
        case TimeRestrictionType.NONE:
          return undefined
      }
    }
    return undefined
  }

  /**
   *
   * @param startDate
   */
  private createAfterFilter(startDate: Date): AfterFilter {
    return new AfterFilter(startDate.toISOString().split('T')[0])
  }

  /**
   *
   * @param startDate
   */
  private createAtFilter(startDate: Date): AtFilter {
    const afterDate = startDate.toISOString().split('T')[0]
    const beforeDate = startDate.toISOString().split('T')[0]
    return new AtFilter(afterDate, beforeDate)
  }

  /**
   *
   * @param startDate
   */
  private createBeforeFilter(startDate: Date): BeforeFilter {
    const beforeDate = startDate.toISOString().split('T')[0]
    return new BeforeFilter(beforeDate)
  }

  /**
   *
   * @param startDate
   * @param endDate
   */
  private createBetweenFilter(startDate: Date, endDate: Date): BetweenFilter {
    const afterDate = startDate.toISOString().split('T')[0]
    const beforeDate = endDate.toISOString().split('T')[0]
    return new BetweenFilter(afterDate, beforeDate)
  }
}
