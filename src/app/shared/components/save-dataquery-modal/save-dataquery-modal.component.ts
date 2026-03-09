import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DataQueryValidationService } from '../../../service/DataQuery/DataQueryValidation.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { SaveDataModal } from '../../models/SaveDataModal/SaveDataModal';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'num-save-dataquery-modal',
  templateUrl: './save-dataquery-modal.component.html',
  styleUrls: ['./save-dataquery-modal.component.scss'],
})
export class SaveDataQueryModalComponent implements OnInit, OnDestroy {
  validatedDataQuery$: Observable<{ feasibilityQuery: boolean; dataSelection: boolean }>;

  @Input()
  isCommentRequired = false;

  @Output()
  save = new EventEmitter<SaveDataModal>();

  @Output()
  cancel = new EventEmitter<void>();

  title = '';
  comment = '';
  isFeasibilityChecked = false;
  isDataSelectionChecked = false;

  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<SaveDataQueryModalComponent>,
    private dataQueryValidation: DataQueryValidationService
  ) {}

  ngOnInit(): void {
    this.validatedDataQuery$ = this.dataQueryValidation.validateDataQuery();
    this.validatedDataQuery$.pipe(takeUntil(this.destroy$)).subscribe((validation) => {
      this.isFeasibilityChecked = validation.feasibilityQuery;
      this.isDataSelectionChecked = validation.dataSelection;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  doSave(): void {
    if (!this.isFeasibilityChecked && !this.isDataSelectionChecked) {
      return;
    }

    this.dialogRef.close({
      title: this.title,
      comment: this.comment,
      feasibilityQuery: this.isFeasibilityChecked,
      dataSelection: this.isDataSelectionChecked,
    });
  }

  doDiscard(): void {
    this.dialogRef.close();
  }

  toggleFeasibilityQuery(checked: boolean) {
    this.isFeasibilityChecked = checked;
  }

  toggleDataSelection(checked: boolean) {
    this.isDataSelectionChecked = checked;
  }
}
