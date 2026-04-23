import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { BuildReferenceCriterionService } from 'src/app/service/Criterion/Build/BuildReferenceCriterionService';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { CriterionBuilder } from 'src/app/model/FeasibilityQuery/Criterion/CriterionBuilder';
import { CriterionValidationService } from 'src/app/service/Criterion/Validation/CriterionValidation.deprecated.service';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { FilterTypes } from '../../../../../model/Utilities/FilterTypes';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion';
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { CloneAbstractCriterion } from 'src/app/model/Utilities/CriterionCloner/CloneReferenceCriterion';
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
    private buildReferenceCriterionService: BuildReferenceCriterionService,
    private referenceCriterionProvider: ReferenceCriterionProviderService,
    private criterionValidationService: CriterionValidationService
  ) {}

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.criterion = this.data.criterion;
  }

  public setSelectedReferenceIds(ids: string[], attributeFilter: AttributeFilter) {
    this.ids = ids;
    this.parentAttributeFilter = attributeFilter;
  }

  public saveReferenceCriterion() {
    this.buildReferenceCriterionService
      .buildReferenceCriteriaFromHashes(this.ids, this.criterion.getId())
      .subscribe((referenceCriteria: ReferenceCriterion[]) => {
        referenceCriteria.forEach((referenceCriterion) =>
          this.referenceCriterionProvider.setOne(referenceCriterion)
        );
        const selectedReferenceFilter = this.parentAttributeFilter
          .getReference()
          .getSelectedReferences();
        selectedReferenceFilter.push(...referenceCriteria);
        this.parentAttributeFilter.getReference().setSelectedReferences(selectedReferenceFilter);
      });
    const copy = CloneAbstractCriterion.deepCopyAbstractCriterion(this.criterion);
    copy.setId(this.criterion.getId());
    this.dialogRef.close(copy);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
