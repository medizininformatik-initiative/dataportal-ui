import { CloneAbstractCriterion } from 'src/app/model/Utilities/CriterionCloner/CloneReferenceCriterion'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { FeasibilityQueryProviderService } from '../../../../service/Provider/FeasibilityQueryProvider.service'
import { Injectable, inject } from '@angular/core'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service'
import { StageProviderService } from '../../../../service/Provider/StageProvider.service'
import { NavigationHelperService } from '../../../../service/NavigationHelper.service'

@Injectable({
  providedIn: 'root',
})
export class CriterionMenuFunctionsService {
  private criterionProviderService = inject(CriterionProviderService)
  private referenceCriterionProviderService = inject(ReferenceCriterionProviderService)
  private stageProviderService = inject(StageProviderService)
  private queryProviderService = inject(FeasibilityQueryProviderService)
  private navigationHelperService = inject(NavigationHelperService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public deleteCriterion(id: string): void {
    this.stageProviderService.removeOne(id)
    this.queryProviderService.deleteFromInclusion(id)
    this.queryProviderService.deleteFromExclusion(id)
    this.criterionProviderService.removeOne(id)
  }

  public duplicateCriterion(id: string): void {
    const clonedCriterion = CloneAbstractCriterion.deepCopyAbstractCriterion(
      this.criterionProviderService.getOne(id),
      false
    )

    clonedCriterion.getReferenceAttributeFilters().forEach((attributeFilter) => {
      if (attributeFilter.isReferenceSet()) {
        const referenceFilter = attributeFilter.getReference()
        const newIds = referenceFilter.getSelectedReferenceIds().map((refId) => {
          const originalRef = this.referenceCriterionProviderService.getOne(refId)
          if (!originalRef) {
            return refId
          }
          const clonedRef = CloneAbstractCriterion.deepCopyAbstractCriterion(
            originalRef,
            false
          ) as ReferenceCriterion
          clonedRef.setParentId(clonedCriterion.getId())
          this.referenceCriterionProviderService.setOne(clonedRef)
          return clonedRef.getId()
        })
        referenceFilter.setSelectedReferenceIds(newIds)
      }
    })

    this.criterionProviderService.setOne(clonedCriterion)
    this.stageProviderService.addOne(clonedCriterion.getId())
  }

  public editCriterionFilter(id: string): void {
    const criterion = this.criterionProviderService.getOne(id)
    if (criterion) {
      this.navigationHelperService.navigateToEditCriterion(id)
    }
  }
}
