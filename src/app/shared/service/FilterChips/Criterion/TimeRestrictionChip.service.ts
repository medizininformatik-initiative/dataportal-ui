import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction';
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData';
import { FilterChipTimeRestrictionAdapter } from '../../../models/FilterChips/Adapter/FilterChipTimeRestrictionAdapter';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeRestrictionChipService {
  /**
   * @param criterion
   * @returns
   */
  public generateTimeRestrictionChips(timeRestriction: AbstractTimeRestriction): FilterChipData[] {
    if (this.isTimeRestrictionSet(timeRestriction)) {
      return FilterChipTimeRestrictionAdapter.adaptTimeRestriction(timeRestriction);
    }
    return [];
  }

  private isTimeRestrictionSet(timeRestriction: AbstractTimeRestriction) {
    return timeRestriction?.getBeforeDate() !== null || timeRestriction?.getAfterDate();
  }
}
