import { Injectable } from '@angular/core';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { InterfaceFilterChip } from 'src/app/shared/models/FilterChips/InterfaceFilterChip';
import { InterfaceFilterChipData } from 'src/app/shared/models/FilterChips/InterfaceFilterChipData';

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
  public generateTermcodeChipsFromCriterion(criterion: Criterion): InterfaceFilterChip {
    const termcodeFilters = criterion.getTermCodes();
    const chips: InterfaceFilterChip[] = [];

    const chip: InterfaceFilterChip = {
      type: 'SHARED_COMPONENTS.CHIPS.TERMINOLOGY_CODE',
      typeExpanded: false,
      twoLineDisplay: false,
      data: termcodeFilters.map((termcodeFilter) => this.createChipData(termcodeFilter)),
    };
    return chip;
  }

  private createChipData(termcodeFilter: TerminologyCode): InterfaceFilterChipData {
    return {
      id: termcodeFilter.getCode(),
      text: termcodeFilter.getCode(),
      expanded: false,
    };
  }
}
