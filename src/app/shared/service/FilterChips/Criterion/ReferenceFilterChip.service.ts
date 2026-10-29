import { Injectable, inject } from '@angular/core'
import { AbstractCriterion } from 'src/app/model/FeasibilityQuery/Criterion/AbstractCriterion'
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service'
import { FilterChipBuilder } from 'src/app/shared/models/FilterChips/FilterChipBuilder'
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData'

@Injectable({
  providedIn: 'root',
})
export class ReferenceFilterChipService {
  private readonly referenceCriterionProvider = inject(ReferenceCriterionProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Creates filter chips for reference filters of a given criterion.
   * @param {AbstractCriterion} criterion
   * @returns {FilterChipData[]}
   */
  public generateReferenceChips(criterion: AbstractCriterion): FilterChipData[] {
    const chips: FilterChipData[] = []
    criterion.getAttributeFilters().forEach((filter) => {
      if (!filter.isReferenceSet()) {
        return
      }
      const selectedReferenceIds = filter.getReference().getSelectedReferenceIds()
      if (selectedReferenceIds.length === 0) {
        return
      }
      const builder = new FilterChipBuilder(filter.getDisplay())
      selectedReferenceIds.forEach((id) => {
        try {
          const ref = this.referenceCriterionProvider.getOne(id)
          builder.addData(ref.getId(), ref.getDisplay())
        } catch {
          // reference criterion not (yet) in provider, skip chip
        }
      })
      chips.push(builder.buildFilterChip())
    })
    return chips
  }
}
