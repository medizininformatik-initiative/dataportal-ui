import { AbstractCriterion } from 'src/app/model/FeasibilityQuery/Criterion/AbstractCriterion';
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction';
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { CriterionBuilder } from 'src/app/model/FeasibilityQuery/Criterion/CriterionBuilder';
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service';
import { CriterionValidationService } from '../../../../../service/Criterion/CriterionValidation.deprecated.service';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter';
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes';

export class EnterCriterionListComponentData {
  criterion: AbstractCriterion;
}

@Component({
  selector: 'num-edit-criterion-modal',
  templateUrl: './edit-criterion-modal.component.html',
  styleUrls: ['./edit-criterion-modal.component.scss'],
})
export class EditCriterionModalComponent implements OnInit {
  criterion: AbstractCriterion;
  criterionBuilder: CriterionBuilder;
  attributeFilters: AttributeFilter[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EnterCriterionListComponentData,
    private dialogRef: MatDialogRef<EditCriterionModalComponent, AbstractCriterion>,
    private criterionProvider: CriterionProviderService,
    private criterionValidationService: CriterionValidationService
  ) {}

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.criterion = this.data.criterion;
    this.attributeFilters = this.filterAttributeFiltersByTypeConcept();
    this.instantiateCriterion();
  }

  private filterAttributeFiltersByTypeConcept(): AttributeFilter[] {
    return this.criterion
      .getAttributeFilters()
      .filter((filter) => filter.getFilterType() === FilterTypes.CONCEPT);
  }

  /**
   * Need to create a copy of the criterion in order to avoid references
   * which lead to unwanted change detection cycles
   *
   * @todo introduce Changedetection.OnPuSh
   */
  private instantiateCriterion() {
    const mandatoryFields = this.createMandatoryFields(this.criterion);
    this.criterionBuilder = new CriterionBuilder(mandatoryFields);
    this.setInitialAttributeFilter();
    this.setInitialValueFilter();
    this.setInitialTimeRestriction();
  }

  private setInitialAttributeFilter() {
    const attributeFilters: AttributeFilter[] = [];
    if (this.criterion.getAttributeFilters().length > 0) {
      this.criterion
        .getAttributeFilters()
        .forEach((attributeFilter) => attributeFilters.push(attributeFilter));
      this.criterionBuilder.withAttributeFilters(attributeFilters);
    }
  }

  private setInitialValueFilter() {
    const currentValueFilter = this.criterion.getValueFilters()[0];
    if (currentValueFilter) {
      const valueFilter: ValueFilter = new ValueFilter(
        currentValueFilter.getDisplay(),
        undefined,
        currentValueFilter.getConcept(),
        currentValueFilter.getQuantity(),
        currentValueFilter.getOptional()
      );
      this.criterionBuilder.withValueFilters([valueFilter]);
    }
  }

  private setInitialTimeRestriction() {
    this.criterionBuilder.withTimeRestriction(this.criterion.getTimeRestriction());
  }

  private createMandatoryFields(criterion: AbstractCriterion): {
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

  public updateValueFilter(valueFilter: ValueFilter) {
    this.criterionBuilder.withValueFilters([valueFilter]);
    this.criterionBuilder.withRequiredFilter(
      this.criterionValidationService.setIsFilterRequired(this.criterionBuilder.buildCriterion())
    );
  }

  public updateAttributeFilter(attributeFilter: AttributeFilter) {
    this.criterionBuilder.withAttributeFilter(attributeFilter);
    this.criterionBuilder.withRequiredFilter(
      this.criterionValidationService.setIsFilterRequired(this.criterionBuilder.buildCriterion())
    );
  }

  public updateTimeRestriction(timeRestriction: AbstractTimeRestriction) {
    this.criterionBuilder.withTimeRestriction(timeRestriction);
  }

  public updateTermCodes(termCodes: TerminologyCode[]) {
    this.criterionBuilder.withTermCodes(termCodes);
  }

  public saveCriterion() {
    if (this.criterion instanceof ReferenceCriterion) {
      const criterion = this.criterionProvider.getCriterionByUID(this.criterion.getParentId());

      criterion.getAttributeFilters().forEach((attributeFilter) => {
        if (attributeFilter.isReferenceSet()) {
          const selectedReferences = attributeFilter.getReference().getSelectedReferences();
          const index = selectedReferences.findIndex(
            (selectedReference) => selectedReference.getId() === this.criterion.getId()
          );
          if (index !== -1) {
            const referenceCriterion = this.criterionBuilder
              .withParentId(criterion.getId())
              .buildReferenceCriterion();
            selectedReferences[index] = referenceCriterion;
          }
        }
      });
      this.dialogRef.close(criterion);
    } else {
      this.dialogRef.close(this.criterionBuilder.buildCriterion());
    }
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
