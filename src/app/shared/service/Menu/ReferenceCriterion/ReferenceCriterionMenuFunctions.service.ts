import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { inject, Injectable } from '@angular/core'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { ReferenceCriterionProviderService } from '../../../../service/Provider/ReferenceCriterionProvider.service'

@Injectable({
  providedIn: 'root',
})
export class ReferenceCriterionMenuFunctionsService {
  private criterionProviderService = inject(CriterionProviderService)
  private referenceCriterionProvider = inject(ReferenceCriterionProviderService)
  private navigationHelperService = inject(NavigationHelperService)

  constructor() {}

  deleteCriterion(id: string) {
    const parentID = this.referenceCriterionProvider.getOne(id)?.getParentId()
    if (!parentID) {
      throw new Error(`ReferenceCriterion with id ${id} does not have a parent ID.`)
    }
    this.criterionProviderService
      .getOne(parentID)
      .getReferenceAttributeFilters()
      .forEach((attributeFilter) => {
        if (attributeFilter.isReferenceSet()) {
          const updatedIds = attributeFilter
            .getReference()
            .getSelectedReferenceIds()
            .filter((refId) => refId !== id)
          attributeFilter.getReference().setSelectedReferenceIds(updatedIds)
        }
      })

    this.referenceCriterionProvider.removeOne(id)
  }

  public duplicateCriterion(id: string) {
    // Not implemented yet
    return
  }

  public applyReferenceCriterionFilter(id: string) {
    const referenceCriterion = this.referenceCriterionProvider.getOne(id)
    const criterion = this.criterionProviderService.getOne(referenceCriterion.getParentId())

    if (!criterion) {
      return
    }
    this.navigationHelperService.navigateToEditReferenceCriterion(id)
  }
}
