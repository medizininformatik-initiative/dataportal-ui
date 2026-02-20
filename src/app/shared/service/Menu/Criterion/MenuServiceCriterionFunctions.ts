import { CloneAbstractCriterion } from 'src/app/model/Utilities/CriterionCloner/CloneReferenceCriterion';
import { CriterionModalService } from 'src/app/service/Criterion/Modal/CriterionModal.service';
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service';
import { FeasibilityQueryProviderService } from '../../../../service/Provider/FeasibilityQueryProvider.service';
import { Injectable } from '@angular/core';
import { StageProviderService } from '../../../../service/Provider/StageProvider.service';

@Injectable({
  providedIn: 'root',
})
export class MenuServiceCriterionFunctions {
  constructor(
    private criterionProviderService: CriterionProviderService,
    private editCriterionService: CriterionModalService,
    private stageProviderService: StageProviderService,
    private queryProviderService: FeasibilityQueryProviderService
  ) {}

  public deleteCriterion(id: string): void {
    this.stageProviderService.deleteCriterionByUID(id);
    this.queryProviderService.deleteFromInclusion(id);
    this.queryProviderService.deleteFromExclusion(id);
    this.criterionProviderService.deleteCriterionFromMapByUID(id);
  }

  public duplicateCriterion(id: string): void {
    const clonedCriterion = CloneAbstractCriterion.deepCopyAbstractCriterion(
      this.criterionProviderService.getCriterionByUID(id)
    );
    this.criterionProviderService.setCriterionByUID(clonedCriterion, clonedCriterion.getId());
    this.stageProviderService.addCriterionToStage(clonedCriterion.getId());
  }

  public editLinkedCriteria(id: string): void {
    const criterion = this.criterionProviderService.getCriterionByUID(id);
    if (criterion) {
      this.editCriterionService.openReferenceCriteriaModal(criterion);
    }
  }

  public editCriterionFilter(id: string): void {
    const criterion = this.criterionProviderService.getCriterionByUID(id);
    if (criterion) {
      this.editCriterionService.openCriterionModal(criterion);
    }
  }
}
