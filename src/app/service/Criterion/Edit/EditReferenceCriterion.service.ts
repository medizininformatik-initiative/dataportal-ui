import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter';
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction';
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { CloneAbstractCriterion } from 'src/app/model/Utilities/CriterionCloner/CloneReferenceCriterion';
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter';
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service';
import { EditAttributeFilterService } from './EditAttributeFilter.service';
import { EditReferenceFilterService } from './EditReferenceFilter.service';
import { EditValueFilterService } from './EditValueFilter.service';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion';
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service';
import { ReferenceFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ReferenceFilter';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';

@Injectable({
  providedIn: 'root',
})
export class EditReferenceCriterionService {
  private workingReferenceCriterion: ReferenceCriterion;

  constructor(
    private referenceCriterionProvider: ReferenceCriterionProviderService,
    private criterionProvider: CriterionProviderService,
    private referenceFilterService: EditReferenceFilterService,
    private valueFilterService: EditValueFilterService,
    private attributeFilterService: EditAttributeFilterService
  ) {}

  public initialize(referenceCriterion: ReferenceCriterion): void {
    const copy = CloneAbstractCriterion.deepCopyAbstractCriterion(
      referenceCriterion,
      true
    ) as ReferenceCriterion;
    copy.setId(referenceCriterion.getId());
    copy.setParentId(referenceCriterion.getParentId());
    this.workingReferenceCriterion = copy;
  }

  public getReferenceCriterion(): ReferenceCriterion {
    if (!this.workingReferenceCriterion) {
      throw new Error(
        'EditReferenceCriterionService: ReferenceCriterion not initialized. Call initialize() first.'
      );
    }
    return this.workingReferenceCriterion;
  }

  public updateConceptAttributeFilter(
    concept: ConceptFilter,
    attributeFilter: AttributeFilter
  ): void {
    const criterion = this.getReferenceCriterion();
    this.applyAttributeFilters(
      criterion,
      this.attributeFilterService.buildFromConcept(criterion, concept, attributeFilter)
    );
    this.emit();
  }

  public updateQuantityAttributeFilter(
    quantityFilter: AbstractQuantityFilter,
    attributeFilter: AttributeFilter
  ): void {
    const criterion = this.getReferenceCriterion();
    this.applyAttributeFilters(
      criterion,
      this.attributeFilterService.buildFromQuantity(criterion, quantityFilter, attributeFilter)
    );
    this.emit();
  }

  public updateTimeRestriction(timeRestriction: AbstractTimeRestriction): void {
    const criterion = this.getReferenceCriterion();
    criterion.setTimeRestriction(timeRestriction);
    this.emit();
  }

  public updateTermCodes(termCodes: TerminologyCode[]): void {
    const criterion = this.getReferenceCriterion();
    criterion.setTermCodes(termCodes);
    this.emit();
  }

  public addReferenceCriteria(
    id: string,
    attributeFilter: AttributeFilter
  ): Observable<ReferenceFilter> {
    return this.referenceFilterService
      .updateReferenceFilter([id], this.getReferenceCriterion().getId(), attributeFilter)
      .pipe(
        tap((updatedReferenceFilter) =>
          this.applyReferenceFilter(attributeFilter, updatedReferenceFilter)
        ),
        tap(() => this.emit())
      );
  }

  public updateSelectedReferences(
    attributeFilter: AttributeFilter,
    updatedReferences: ReferenceCriterion[]
  ): void {
    const updatedReferenceFilter = this.referenceFilterService.updateSelectedReferences(
      updatedReferences,
      attributeFilter
    );
    this.applyReferenceFilter(attributeFilter, updatedReferenceFilter);
    this.emit();
  }

  public updateConceptValueFilter(conceptFilter: ConceptFilter): void {
    const criterion = this.getReferenceCriterion();
    criterion.setValueFilters(this.valueFilterService.buildFromConcept(criterion, conceptFilter));
    this.emit();
  }

  public updateQuantityValueFilter(quantityFilter: AbstractQuantityFilter): void {
    const criterion = this.getReferenceCriterion();
    criterion.setValueFilters(this.valueFilterService.buildFromQuantity(criterion, quantityFilter));
    this.emit();
  }

  private applyAttributeFilters(
    criterion: ReferenceCriterion,
    attributeFilters: AttributeFilter[]
  ): void {
    criterion.setAttributeFilters(attributeFilters);
    criterion.setIsRequiredFilterSet(this.attributeFilterService.isFilterRequired(criterion));
  }

  private applyReferenceFilter(
    attributeFilter: AttributeFilter,
    referenceFilter: ReferenceFilter
  ): void {
    const criterion = this.getReferenceCriterion();
    this.applyAttributeFilters(
      criterion,
      this.attributeFilterService.buildFromReference(criterion, referenceFilter, attributeFilter)
    );
  }

  private emit(): void {
    const copy = CloneAbstractCriterion.deepCopyAbstractCriterion(
      this.workingReferenceCriterion,
      true
    ) as ReferenceCriterion;
    copy.setId(this.workingReferenceCriterion.getId());
    copy.setParentId(this.workingReferenceCriterion.getParentId());
    this.workingReferenceCriterion = copy;
    this.referenceCriterionProvider.setOne(this.workingReferenceCriterion);
    this.updateParentCriterion();
  }

  private updateParentCriterion(): void {
    const parentId = this.workingReferenceCriterion.getParentId();
    if (!parentId) {
      return;
    }
    try {
      const parentCriterion = this.criterionProvider.getOne(parentId);
      const updatedAttributeFilters = parentCriterion
        .getAttributeFilters()
        .map((attributeFilter) => {
          const referenceFilter = attributeFilter.getReference();
          if (!referenceFilter) {
            return attributeFilter;
          }
          const updatedReferences = referenceFilter
            .getSelectedReferences()
            .map((ref) =>
              ref.getId() === this.workingReferenceCriterion.getId()
                ? this.workingReferenceCriterion
                : ref
            );
          attributeFilter.setReference(
            ReferenceFilter.create(
              referenceFilter.getId(),
              [...referenceFilter.getAllowedReferenceUri()],
              updatedReferences
            )
          );
          return attributeFilter;
        });
      parentCriterion.setAttributeFilters(updatedAttributeFilters);
      this.criterionProvider.setOne(parentCriterion);
    } catch {
      // parent criterion not found in provider, nothing to update
    }
  }
}
