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
   * @param criterion
   * @returns {FilterChipData[]}
   * @param {AbstractTimeRestriction} timeRestriction
   */
  public generateTimeRestrictionChips(timeRestriction: AbstractTimeRestriction): FilterChipData[] {
    if (this.isTimeRestrictionSet(timeRestriction)) {
      return FilterChipTimeRestrictionAdapter.adaptTimeRestriction(timeRestriction)
    }
    return []
  }

  private isTimeRestrictionSet(timeRestriction: AbstractTimeRestriction) {
    return timeRestriction?.getBeforeDate() !== null || timeRestriction?.getAfterDate()
  }
}
