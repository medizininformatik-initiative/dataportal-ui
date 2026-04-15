import { AbstractCriterion } from 'src/app/model/FeasibilityQuery/Criterion/AbstractCriterion';
import { FilterChipBuilder } from 'src/app/shared/models/FilterChips/FilterChipBuilder';
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReferenceFilterChipService {
  /**
   * Creates filter chips for reference filters of a given criterion.
   * @param criterion
   * @returns
   */
  public generateReferenceChips(criterion: AbstractCriterion): FilterChipData[] {
    const chips: FilterChipData[] = [];
    criterion.getAttributeFilters().forEach((filter) => {
      if (!filter.isReferenceSet()) {
        return;
      }
      const selectedReferences = filter.getReference().getSelectedReferences();
      if (selectedReferences.length === 0) {
        return;
      }
      const builder = new FilterChipBuilder(filter.getDisplay());
      selectedReferences.forEach((ref) => builder.addData(ref.getId(), ref.getDisplay()));
      chips.push(builder.buildFilterChip());
    });
    return chips;
  }
}
