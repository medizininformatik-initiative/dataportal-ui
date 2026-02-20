import { CriterionModalService } from 'src/app/service/Criterion/Modal/CriterionModal.service';
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service';
import { Injectable } from '@angular/core';
import { ReferenceCriterionProviderService } from '../../../../service/Provider/ReferenceCriterionProvider.service';

@Injectable({
  providedIn: 'root',
})
export class RefrenceCriterionMenuFunctionsService {
  constructor(
    private criterionProviderService: CriterionProviderService,
    private editCriterionService: CriterionModalService,
    private referenceCriterionProvider: ReferenceCriterionProviderService
  ) {}

  deleteCriterion(uid: string) {
    const parentID = this.referenceCriterionProvider.getReferenceCriterionByUID(uid).getParentId();
    this.criterionProviderService
      .getCriterionByUID(parentID)
      .getAttributeFilters()
      .forEach((attributeFilter) => {
        if (attributeFilter.isReferenceSet()) {
          const updatedReferences = attributeFilter
            .getReference()
            .getSelectedReferences()
            .filter((reference) => reference.getId() !== uid);
          attributeFilter.getReference().setSelectedReferences(updatedReferences);
        }
      });

    this.referenceCriterionProvider.deleteReferenceCriterionFromMapByUID(uid);
  }

  duplicateCriterion(uid: string) {
    const originalElement = this.criterionProviderService.getCriterionByUID(uid);
    if (originalElement) {
      const duplicateElement = { ...originalElement };
    }
  }

  applyReferenceCriterionFilter(uid: string) {
    this.editCriterionService.openCriterionModal(
      this.criterionProviderService.getCriterionByUID(uid) ??
        this.referenceCriterionProvider.getReferenceCriterionByUID(uid)
    );
  }
}
