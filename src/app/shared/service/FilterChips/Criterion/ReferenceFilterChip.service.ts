import { AbstractCriterion } from 'src/app/model/FeasibilityQuery/Criterion/AbstractCriterion';
import { FilterChipBuilder } from 'src/app/shared/models/FilterChips/FilterChipBuilder';
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData';
import { Injectable } from '@angular/core';
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service';

@Injectable({
  providedIn: 'root',
})
export class ReferenceFilterChipService {
  constructor(private referenceCriterionProvider: ReferenceCriterionProviderService) {}

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
      const selectedReferenceIds = filter.getReference().getSelectedReferenceIds();
      if (selectedReferenceIds.length === 0) {
        return;
      }
      const builder = new FilterChipBuilder(filter.getDisplay());
      selectedReferenceIds.forEach((id) => {
        try {
          const ref = this.referenceCriterionProvider.getOne(id);
          builder.addData(ref.getId(), ref.getDisplay());
        } catch {
          // reference criterion not (yet) in provider, skip chip
        }
      });
      chips.push(builder.buildFilterChip());
    });
    return chips;
  }
}
