import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery';
import { CriterionProviderService } from '../../Provider/CriterionProvider.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InvalidCriteriaService {
  constructor(private criterionService: CriterionProviderService) {}

  public getInvalidCriteriaList(feasibilityQuery: FeasibilityQuery): string[] {
    const invalidCriteria: string[] = [];

    feasibilityQuery.getInclusionCriteria().forEach((criteriaGroup) => {
      this.processInvalidCriteria(criteriaGroup, invalidCriteria);
    });
    feasibilityQuery.getExclusionCriteria().forEach((criteriaGroup) => {
      this.processInvalidCriteria(criteriaGroup, invalidCriteria);
    });

    return invalidCriteria;
  }

  private processInvalidCriteria(criteriaGroup: string[], invalidCriteria: string[]): void {
    criteriaGroup.forEach((criterionId) => {
      const criterion = this.criterionService.getOne(criterionId);
      if (criterion.getIsInvalid()) {
        invalidCriteria.push(criterionId);
      }
    });
  }
}
