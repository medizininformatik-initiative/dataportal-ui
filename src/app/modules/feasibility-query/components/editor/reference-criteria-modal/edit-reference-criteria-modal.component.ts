import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { CreateCriterionService } from 'src/app/service/Criterion/CreateCriterionService';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { CriterionBuilder } from 'src/app/model/FeasibilityQuery/Criterion/CriterionBuilder';
import { CriterionValidationService } from '../../../../../service/Criterion/CriterionValidation.deprecated.service';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion';
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { FilterTypes } from '../../../../../model/Utilities/FilterTypes';
@Component({
  selector: 'num-edit-reference-criteria',
  templateUrl: './edit-reference-criteria-modal.component.html',
  styleUrls: ['./edit-reference-criteria-modal.component.scss'],
})
export class EditReferenceCriteriaModalComponent implements OnInit {
  criterion: Criterion;

  ids: string[] = [];

  parentAttributeFilter: AttributeFilter;
  referenceFilter: AttributeFilter[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EditReferenceCriteriaModalComponent,
    private dialogRef: MatDialogRef<EditReferenceCriteriaModalComponent, Criterion>,
    private createCriterionService: CreateCriterionService,
    private referenceCriterionProvider: ReferenceCriterionProviderService,
    private criterionValidationService: CriterionValidationService
  ) {}

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.criterion = this.data.criterion;
    this.referenceFilter = this.filterAttributeFiltersByTypeReference();
  }

  public setSelectedReferenceIds(ids: string[], attributeFilter: AttributeFilter) {
    this.ids = ids;
    this.parentAttributeFilter = attributeFilter;
  }

  public saveReferenceCriterion() {
    this.createCriterionService
      .createReferenceCriteriaFromHashes(this.ids, this.criterion.getId())
      .subscribe((referenceCriteria: ReferenceCriterion[]) => {
        referenceCriteria.forEach((referenceCriterion) =>
          this.referenceCriterionProvider.setReferenceCriterionByUID(
            referenceCriterion.getId(),
            referenceCriterion
          )
        );
        const selectedReferenceFilter = this.parentAttributeFilter
          .getReference()
          .getSelectedReferences();
        selectedReferenceFilter.push(...referenceCriteria);
        this.parentAttributeFilter.getReference().setSelectedReferences(selectedReferenceFilter);
      });
    const mandatoryFields = this.createMandatoryFields(this.criterion);
    const criterionBuilder = new CriterionBuilder(mandatoryFields);
    criterionBuilder
      .withTimeRestriction(this.criterion.getTimeRestriction())
      .withValueFilters(this.criterion.getValueFilters() ?? [])
      .withAttributeFilters(this.criterion.getAttributeFilters())
      .withAttributeFilter(this.parentAttributeFilter);
    const criterion = criterionBuilder.buildCriterion();
    this.dialogRef.close(criterion);
  }

  private createMandatoryFields(criterion: Criterion): {
    isReference: boolean
    context: TerminologyCode
    criterionHash: string
    display: Display
    isInvalid: boolean
    isRequiredFilterSet: boolean
    uniqueID: string
    termCodes: Array<TerminologyCode>
  } {
    const context = criterion.getContext();
    const termCodes = criterion.getTermCodes();
    const display = criterion.getDisplay();
    const criterionHash = this.criterion.getCriterionHash();
    const isRequiredFilterSet = this.criterionValidationService.setIsFilterRequired(this.criterion);
    return {
      isReference: false,
      context,
      criterionHash,
      display,
      isInvalid: false,
      isRequiredFilterSet,
      uniqueID: criterion.getId(),
      termCodes,
    };
  }

  private filterAttributeFiltersByTypeReference(): AttributeFilter[] {
    return this.criterion
      .getAttributeFilters()
      .filter((filter) => filter.getFilterType() === FilterTypes.REFERENCE);
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
