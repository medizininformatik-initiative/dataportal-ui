import { Component, inject } from '@angular/core'
import { DownloadErrorLogService } from 'src/app/service/Download/DownloadErrroLog.service'
import { ErrorLogModalComponent } from '../error-log-modal.component'
import { ErrorLogProviderService } from 'src/app/service/Validation/ErrorLogProvider.service'
import { MatDialogRef } from '@angular/material/dialog'
import { ButtonComponent } from '../../../../shared/components/button/button.component'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-error-log-actions',
  templateUrl: './error-log-actions.component.html',
  styleUrls: ['./error-log-actions.component.scss'],
  standalone: true,
  imports: [ButtonComponent, MatTooltip, TranslateModule],
})
export class ErrorLogActionsComponent {
  private readonly errorLogProvider = inject(ErrorLogProviderService)
  private readonly downloadErrorLogService = inject(DownloadErrorLogService)
  private readonly dialogRef = inject<MatDialogRef<ErrorLogModalComponent>>(MatDialogRef)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public clear(): void {
    this.errorLogProvider.clearValidationResult()
  }

  public download(): void {
    this.downloadErrorLogService.download()
  }

  public close(): void {
    this.dialogRef.close()
  }
}
