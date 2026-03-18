import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ErrorLogProviderService } from 'src/app/service/Validation/ErrorLogProvider.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject, tap } from 'rxjs';
import { ValidationIssue } from 'src/app/model/Validation/ValidationIssue';
import { ValidationReport } from 'src/app/model/Validation/ValidationReport';
import { ProfileUpgrade } from 'src/app/model/Upgrade/ProfileUpgrade';

@Component({
  selector: 'num-error-log-modal',
  templateUrl: './error-log-modal.component.html',
  styleUrls: ['./error-log-modal.component.scss'],
})
export class ErrorLogModalComponent implements OnInit, OnDestroy {
  validationReport: ValidationReport | null = null;
  errors: ValidationIssue[] = [];

  upgrades$: Observable<ProfileUpgrade[] | null>;
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ValidationReport,
    private errorLogProvider: ErrorLogProviderService
  ) {}
  ngOnInit(): void {
    console.log(this.data);
    this.validationReport = this.data;
    if (this.data instanceof ValidationReport) {
      this.errors = this.data?.getIssues() || [];
    }
    this.upgrades$ = this.errorLogProvider.getProfileUpgrade$();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
