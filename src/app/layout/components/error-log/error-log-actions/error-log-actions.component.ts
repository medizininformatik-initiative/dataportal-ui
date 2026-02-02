import { Component } from '@angular/core';
import { DownloadErrorLogService } from 'src/app/service/Download/DownloadErrroLog.service';
import { ErrorLogModalComponent } from '../error-log-modal.component';
import { ErrorLogProviderService } from 'src/app/service/Validation/ErrorLogProvider.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'num-error-log-actions',
  templateUrl: './error-log-actions.component.html',
  styleUrls: ['./error-log-actions.component.scss'],
})
export class ErrorLogActionsComponent {
  constructor(
    private readonly errorLogProvider: ErrorLogProviderService,
    private readonly downloadErrorLogService: DownloadErrorLogService,
    private readonly dialogRef: MatDialogRef<ErrorLogModalComponent>
  ) {}

  public clear(): void {
    this.errorLogProvider.clearValidationResult();
  }

  public download(): void {
    this.downloadErrorLogService.download();
  }

  public close(): void {
    this.dialogRef.close();
  }
}
