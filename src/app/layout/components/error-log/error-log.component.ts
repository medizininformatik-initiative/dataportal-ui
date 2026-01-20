import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { DownloadErrorLogService } from '../../../service/Download/DownloadErrroLog.service';
import { ErrorLog } from 'src/app/model/Validation/ErrorLog';
import { ErrorLogProviderService } from '../../../service/Validation/ErrorLogProvider.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ValidationError } from 'src/app/model/Validation/ValidationError';
import { ValidationResponseData } from 'src/app/model/Interface/Validation/BackendValidationError';

@Component({
  selector: 'num-error-log',
  templateUrl: './error-log.component.html',
  styleUrls: ['./error-log.component.scss'],
})
export class ErrorLogComponent implements OnInit, OnDestroy {
  validationResult: ErrorLog | null = null;
  errors: ValidationError[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private readonly errorLogProvider: ErrorLogProviderService,
    private readonly downloadErrorLogService: DownloadErrorLogService,
    private readonly dialogRef: MatDialogRef<ErrorLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Observable<ErrorLog>
  ) {}

  ngOnInit(): void {
    this.data.pipe(takeUntil(this.destroy$)).subscribe((result) => {
      this.validationResult = result;
      this.errors = result?.getErrors() || [];
      console.log('Received validation result in ErrorLogComponent:', this.validationResult);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public clearErrors(): void {
    this.errorLogProvider.clearValidationResult();
  }

  public downloadErrorLog(): void {
    this.downloadErrorLogService.download();
  }

  public closeModal(): void {
    this.dialogRef.close();
  }
}
