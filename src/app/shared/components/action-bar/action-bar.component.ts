import { AsyncPipe } from '@angular/common'
import { combineLatest, map, Observable, Subscription } from 'rxjs'
import { Component, inject, input, OnInit } from '@angular/core'
import { DownloadCRTDLComponent } from '../download-crtdl/download-crtdl.component'
import { FeasibilityQueryValidationService } from 'src/app/service/FeasibilityQuery/FeasibilityQueryValidation.service'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { MatTooltip } from '@angular/material/tooltip'
import { SaveDataQueryModalService } from 'src/app/service/SaveDataQueryModal.service'
import { toObservable } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'
import { UploadService } from 'src/app/service/Upload/Upload.service'

@Component({
  selector: 'num-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
  standalone: true,
  imports: [MatTooltip, FontAwesomeModule, AsyncPipe, TranslateModule],
})
export class ActionBarComponent {
  private dialog = inject(MatDialog)

  private saveDataQueryModalService = inject(SaveDataQueryModalService)

  private uploadService = inject(UploadService)

  private feasibilityQueryValidationService = inject(FeasibilityQueryValidationService)

  readonly showUpload = input(true)
  readonly showDownload = input(true)
  readonly showSave = input(true)

  readonly downloadAllowed$ = combineLatest([
    this.feasibilityQueryValidationService.getIsFeasibilityQueryValid(),

    toObservable(this.showDownload),
  ]).pipe(map(([isValid, showDownload]) => isValid && showDownload))

  public upload(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files[0]

    this.uploadService.uploadCRTDL(file)
  }

  public downloadCRTDL(): void {
    const dialogConfig = new MatDialogConfig()

    dialogConfig.autoFocus = true

    this.dialog.open(DownloadCRTDLComponent, dialogConfig).afterClosed().subscribe()
  }

  public onSaveDataQuery(): void {
    this.saveDataQueryModalService.openSaveDataQueryModal().subscribe()
  }
}
