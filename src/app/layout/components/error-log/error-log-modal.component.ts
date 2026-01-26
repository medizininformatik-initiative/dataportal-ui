import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ErrorLog } from 'src/app/model/Validation/ErrorLog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ValidationError } from 'src/app/model/Validation/ValidationError';

@Component({
  selector: 'num-error-log-modal',
  templateUrl: './error-log-modal.component.html',
  styleUrls: ['./error-log-modal.component.scss'],
})
export class ErrorLogModalComponent implements OnInit, OnDestroy {
  validationResult: ErrorLog | null = null;
  errors: ValidationError[] = [];
  private destroy$ = new Subject<void>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: ErrorLog) {}

  ngOnInit(): void {
    this.validationResult = this.data;
    this.errors = this.data?.getErrors() || [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
