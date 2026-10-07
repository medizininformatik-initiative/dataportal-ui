import { AbstractTimeRestriction as SQAbstractTimeRestriction } from '../../../model/StructuredQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { AbstractTimeRestriction as FQAbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { AfterFilter } from 'src/app/model/StructuredQuery/Criterion/TimeRestriction/AfterFilter'
import { AtFilter } from 'src/app/model/StructuredQuery/Criterion/TimeRestriction/AtFilter'
import { BeforeFilter } from 'src/app/model/StructuredQuery/Criterion/TimeRestriction/BeforeFilter'
import { BetweenFilter } from 'src/app/model/StructuredQuery/Criterion/TimeRestriction/BetweenFilter'
import { CCDLTimeRestriction } from 'src/app/model/CohortDefinition/CCDLTimeRestriction'
import { Injectable } from '@angular/core'
import { TimeRestrictionType } from 'src/app/model/FeasibilityQuery/TimeRestriction'

@Injectable({
  providedIn: 'root',
})
export class TimeRestrictionTranslationService {
  /**
   * Translates a Criterion's time restriction into a structured query.
   *
   * @param criterion The criterion containing the time restriction.
   * @returns The corresponding time restriction filter.
   */
  public translateTimeRestrictionToStructuredQuery(
    timeRestriction: FQAbstractTimeRestriction
  ): SQAbstractTimeRestriction | undefined {
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
   * The cohort-side result of `translateTimeRestrictionToStructuredQuery`, as plain data.
   * ponytail: delegates to the old classes, which the data extraction still needs; inline the
   * date logic here once they are deleted.
   */
  public translateTimeRestriction(
    timeRestriction: FQAbstractTimeRestriction
  ): CCDLTimeRestriction | undefined {
    const restriction = this.translateTimeRestrictionToStructuredQuery(timeRestriction)
    const afterDate = restriction?.getAfterDate()
    const beforeDate = restriction?.getBeforeDate()
    if (afterDate) {
      return beforeDate ? { afterDate, beforeDate } : { afterDate }
    }
    return beforeDate ? { beforeDate } : undefined
  }

  private createAfterFilter(startDate: Date): AfterFilter {
    return new AfterFilter(startDate.toISOString().split('T')[0])
  }

  private createAtFilter(startDate: Date): AtFilter {
    const afterDate = startDate.toISOString().split('T')[0]
    const beforeDate = startDate.toISOString().split('T')[0]
    return new AtFilter(afterDate, beforeDate)
  }

  private createBeforeFilter(startDate: Date): BeforeFilter {
    const beforeDate = startDate.toISOString().split('T')[0]
    return new BeforeFilter(beforeDate)
  }

  private createBetweenFilter(startDate: Date, endDate: Date): BetweenFilter {
    const afterDate = startDate.toISOString().split('T')[0]
    const beforeDate = endDate.toISOString().split('T')[0]
    return new BetweenFilter(afterDate, beforeDate)
  }
}
