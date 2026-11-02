import { inject, Injectable } from '@angular/core'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { ReferenceCriterionProviderService } from '../../../../service/Provider/ReferenceCriterionProvider.service'

@Injectable({
  providedIn: 'root',
})
export class ReferenceCriterionMenuFunctionsService {
  private readonly criterionProviderService = inject(CriterionProviderService)
  private readonly referenceCriterionProvider = inject(ReferenceCriterionProviderService)
  private readonly navigationHelperService = inject(NavigationHelperService)

  constructor() {}

  /**
   * Deletes the reference criterion from its parent criterion.
   * @param {string} id
   */
  public deleteCriterion(id: string): void {
    const parentID = this.referenceCriterionProvider.getOne(id)?.getParentId()
    if (!parentID) {
      throw new Error(`ReferenceCriterion with id ${id} does not have a parent ID.`)
    }
    this.criterionProviderService
      .getOne(parentID)
      .getReferenceAttributeFilters()
      .forEach((attributeFilter: AttributeFilter) => {
        if (attributeFilter.isReferenceSet()) {
          const updatedIds = attributeFilter
            .getReference()
            .getSelectedReferenceIds()
            .filter((refId: string) => refId !== id)
          attributeFilter.getReference().setSelectedReferenceIds(updatedIds)
        }
      })

    this.referenceCriterionProvider.removeOne(id)
  }

  /**
   * Not implemented yet.
   */
  public duplicateCriterion(): void {
    // Not implemented yet
    return
  }

  /**
   * Applies the reference criterion filter to the parent criterion.
   * @param {string} id
   */
  public applyReferenceCriterionFilter(id: string): void {
    const referenceCriterion = this.referenceCriterionProvider.getOne(id)
    const criterion = this.criterionProviderService.getOne(referenceCriterion.getParentId())

    if (!criterion) {
      return
    }
    this.navigationHelperService.navigateToEditReferenceCriterion(id)
  }
}
