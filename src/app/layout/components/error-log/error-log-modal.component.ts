import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ValidationIssue } from 'src/app/model/Validation/ValidationIssue';
import { ValidationReport } from 'src/app/model/Validation/ValidationReport';

@Component({
  selector: 'num-error-log-modal',
  templateUrl: './error-log-modal.component.html',
  styleUrls: ['./error-log-modal.component.scss'],
})
export class ErrorLogModalComponent implements OnInit, OnDestroy {
  validationReport: ValidationReport | null = null;
  errors: ValidationIssue[] = [];
  private destroy$ = new Subject<void>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: ValidationReport) {}
  ngOnInit(): void {
    this.validationReport = this.data;
    this.errors = this.data?.getIssues() || [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
