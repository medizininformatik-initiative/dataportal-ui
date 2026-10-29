import { Injectable } from '@angular/core'
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { AfterFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AfterFilter'
import { AtFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AtFilter'
import { BeforeFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/BeforeFilter'
import { BetweenFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/BetweenFilter'
import { TimeRestrictionData } from 'src/app/model/Interface/TimeRestrictionData'

@Injectable({
  providedIn: 'root',
})
export class UITimeRestrictionFactoryService {
  constructor() {}

  public createTimeRestrictionForDataSelection(timeRestriction: any): AbstractTimeRestriction {
    if (timeRestriction.start && timeRestriction.end) {
      if (timeRestriction.start === timeRestriction.end) {
        return new AtFilter(timeRestriction.start, timeRestriction.end)
      } else {
        return new BetweenFilter(timeRestriction.start, timeRestriction.end)
      }
    }
    if (timeRestriction.end && !timeRestriction.start) {
      return new BeforeFilter(timeRestriction.end)
    }
    if (!timeRestriction.end && timeRestriction.start) {
      return new AfterFilter(timeRestriction.start)
    }
  }

  public createTimeRestrictionForFeasibilityQuery(timeRestriction: TimeRestrictionData): AbstractTimeRestriction {
    const beforeDate: string = timeRestriction.beforeDate
    const afterDate: string = timeRestriction.afterDate
    if (beforeDate && afterDate) {
      if (beforeDate === afterDate) {
        return new AtFilter(afterDate, beforeDate)
      } else {
        return new BetweenFilter(afterDate, beforeDate)
      }
    }
    if (beforeDate && !afterDate) {
      return new BeforeFilter(beforeDate)
    }
    if (!beforeDate && afterDate) {
      return new AfterFilter(afterDate)
    }
  }
}
