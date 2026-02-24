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
    this.stageProviderService.removeOne(id);
    this.queryProviderService.deleteFromInclusion(id);
    this.queryProviderService.deleteFromExclusion(id);
    this.criterionProviderService.removeOne(id);
  }

  public duplicateCriterion(id: string): void {
    const clonedCriterion = CloneAbstractCriterion.deepCopyAbstractCriterion(
      this.criterionProviderService.getOne(id)
    );
    this.criterionProviderService.setOne(clonedCriterion);
    this.stageProviderService.addOne(clonedCriterion.getId());
  }

  public editLinkedCriteria(id: string): void {
    const criterion = this.criterionProviderService.getOne(id);
    if (criterion) {
      this.editCriterionService.openReferenceCriteriaModal(criterion);
    }
  }

  public editCriterionFilter(id: string): void {
    const criterion = this.criterionProviderService.getOne(id);
    if (criterion) {
      this.editCriterionService.openCriterionModal(criterion);
    }
  }
}
