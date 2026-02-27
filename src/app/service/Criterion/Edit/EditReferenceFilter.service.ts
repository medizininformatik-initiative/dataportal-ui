import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { BuildReferenceCriterionService } from '../Build/BuildReferenceCriterionService';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion';
import { ReferenceCriterionProviderService } from '../../Provider/ReferenceCriterionProvider.service';

@Injectable({
  providedIn: 'root',
})
export class EditReferenceFilterService {
  constructor(
    private buildReferenceCriterionService: BuildReferenceCriterionService,
    private referenceCriterionProvider: ReferenceCriterionProviderService
  ) {}

  /**
   * Fetches reference criteria and applies them to provider + filter
   */
  public updateReferenceFilter(
    ids: string[],
    criterionId: string,
    attributeFilter: AttributeFilter
  ): Observable<ReferenceCriterion[]> {
    return this.buildReferenceCriterionService
      .buildReferenceCriteriaFromHashes(ids, criterionId)
      .pipe(
        tap((referenceCriteria) => {
          this.updateProvider(referenceCriteria);
          this.updateSelectedReferences(referenceCriteria, attributeFilter);
        })
      );
  }

  private updateProvider(references: ReferenceCriterion[]): void {
    references.forEach((reference) => this.referenceCriterionProvider.setOne(reference));
  }

  private updateSelectedReferences(
    references: ReferenceCriterion[],
    attributeFilter: AttributeFilter
  ): void {
    const reference = attributeFilter.getReference();

    const updated = [...reference.getSelectedReferences(), ...references];

    reference.setSelectedReferences(updated);
  }
}
