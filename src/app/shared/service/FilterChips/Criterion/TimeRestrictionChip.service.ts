import { Injectable } from '@angular/core'
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData'
import { FilterChipTimeRestrictionAdapter } from '../../../models/FilterChips/Adapter/FilterChipTimeRestrictionAdapter'

@Injectable({
  providedIn: 'root',
})
export class TimeRestrictionChipService {
  /**
   * Generates the time restriction chips.
   * @param {AbstractTimeRestriction} timeRestriction
   * @returns {FilterChipData[]}
   */
  public generateTimeRestrictionChips(timeRestriction: AbstractTimeRestriction): FilterChipData[] {
    if (this.isTimeRestrictionSet(timeRestriction)) {
      return FilterChipTimeRestrictionAdapter.adaptTimeRestriction(timeRestriction)
    }
    return []
  }

  /**
   * Checks whether the time restriction has a before or after date.
   * @param {AbstractTimeRestriction} timeRestriction
   * @returns {string | true}
   */
  private isTimeRestrictionSet(timeRestriction: AbstractTimeRestriction): string | true {
    return timeRestriction?.getBeforeDate() !== null || timeRestriction?.getAfterDate()
  }
}
