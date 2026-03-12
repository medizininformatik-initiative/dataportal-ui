import { Injectable } from '@angular/core';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData';
import { FilterChipPropertyData } from 'src/app/shared/models/FilterChips/FilterChipPropertyData';

@Injectable({
  providedIn: 'root',
})
export class TerminologyCodeChipService {
  constructor() {}

  /**
   * Generates terminology code filter chips from a specific Criterion.
   *
   * @param criterion The Criterion object
   * @returns Array of InterfaceFilterChip
   */
  public generateTermcodeChipsFromCriterion(criterion: Criterion): FilterChipData {
    const termcodeFilters = criterion.getTermCodes();
    const chips: FilterChipData[] = [];

    const chip: FilterChipData = {
      type: 'SHARED_COMPONENTS.CHIPS.TERMINOLOGY_CODE',
      typeExpanded: false,
      twoLineDisplay: false,
      data: termcodeFilters.map((termcodeFilter) => this.createChipData(termcodeFilter)),
    };
    return chip;
  }

  private createChipData(termcodeFilter: TerminologyCode): FilterChipPropertyData {
    return {
      id: termcodeFilter.getCode(),
      text: termcodeFilter.getCode(),
      expanded: false,
    };
  }
}
