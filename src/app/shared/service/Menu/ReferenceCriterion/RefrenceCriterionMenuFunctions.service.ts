import { CriterionModalService } from 'src/app/service/Criterion/Modal/CriterionModal.service';
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service';
import { Injectable } from '@angular/core';
import { ReferenceCriterionProviderService } from '../../../../service/Provider/ReferenceCriterionProvider.service';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';

@Injectable({
  providedIn: 'root',
})
export class RefrenceCriterionMenuFunctionsService {
  constructor(
    private criterionProviderService: CriterionProviderService,
    private editCriterionService: CriterionModalService,
    private referenceCriterionProvider: ReferenceCriterionProviderService,
    private navigationHelperService: NavigationHelperService
  ) {}

  deleteCriterion(id: string) {
    const parentID = this.referenceCriterionProvider.getOne(id)?.getParentId();
    if (!parentID) {
      throw new Error(`ReferenceCriterion with id ${id} does not have a parent ID.`);
    }
    this.criterionProviderService
      .getOne(parentID)
      .getReferenceAttributeFilters()
      .forEach((attributeFilter) => {
        if (attributeFilter.isReferenceSet()) {
          const updatedIds = attributeFilter
            .getReference()
            .getSelectedReferenceIds()
            .filter((refId) => refId !== id);
          attributeFilter.getReference().setSelectedReferenceIds(updatedIds);
        }
      });

    this.referenceCriterionProvider.removeOne(id);
  }

  public duplicateCriterion(id: string) {
    // Not implemented yet
    return;
  }

  public applyReferenceCriterionFilter(id: string) {
    const referenceCriterion = this.referenceCriterionProvider.getOne(id);
    const criterion = this.criterionProviderService.getOne(referenceCriterion.getParentId());

    if (!criterion) {
      return;
    }
    this.navigationHelperService.navigateToEditReferenceCriterion(id);
  }
}
