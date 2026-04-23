import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { BuildReferenceCriterionService } from '../Build/BuildReferenceCriterionService';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { ReferenceFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ReferenceFilter';
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
  ): Observable<ReferenceFilter> {
    return this.buildReferenceCriterionService
      .buildReferenceCriteriaFromHashes(ids, criterionId)
      .pipe(
        tap((referenceCriteria) => {
          this.updateProvider(referenceCriteria);
        }),
        map((referenceCriteria) => this.addSelectedReferences(referenceCriteria, attributeFilter))
      );
  }

  private updateProvider(references: ReferenceCriterion[]): void {
    console.log('Updating provider with references:', references);
    references.forEach((reference) => this.referenceCriterionProvider.setOne(reference));
  }

  public updateSelectedReferences(
    updatedReferences: ReferenceCriterion[],
    attributeFilter: AttributeFilter
  ): ReferenceFilter {
    return this.buildReferenceFilter(attributeFilter.getReference(), updatedReferences);
  }

  private addSelectedReferences(
    references: ReferenceCriterion[],
    attributeFilter: AttributeFilter
  ): ReferenceFilter {
    const reference = attributeFilter.getReference();

    return this.buildReferenceFilter(reference, [
      ...reference.getSelectedReferences(),
      ...references,
    ]);
  }

  private buildReferenceFilter(
    referenceFilter: ReferenceFilter,
    selectedReferences: ReferenceCriterion[]
  ): ReferenceFilter {
    return ReferenceFilter.create(
      referenceFilter.getId(),
      [...referenceFilter.getAllowedReferenceUri()],
      [...selectedReferences]
    );
  }
}
