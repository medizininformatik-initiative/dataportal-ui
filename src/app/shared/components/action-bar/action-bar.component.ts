import { Component, Input, OnInit, inject } from '@angular/core'
import { DownloadCRTDLComponent } from '../download-crtdl/download-crtdl.component'
import { FeasibilityQueryValidationService } from 'src/app/service/FeasibilityQuery/FeasibilityQueryValidation.service'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { SaveDataQueryModalService } from 'src/app/service/SaveDataQueryModal.service'
import { map, Observable, Subscription } from 'rxjs'
import { UploadService } from 'src/app/service/Upload/Upload.service'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
  standalone: true,
  imports: [MatTooltip, FontAwesomeModule, AsyncPipe, TranslateModule],
})
export class ActionBarComponent implements OnInit {
  private dialog = inject(MatDialog)
  private saveDataQueryModalService = inject(SaveDataQueryModalService)
  private uploadService = inject(UploadService)
  private feasibilityQueryValidationService = inject(FeasibilityQueryValidationService)

  @Input() showUpload = true
  @Input() showDownload = true
  @Input() showSave = true

  downloadAllowed$: Observable<boolean>

  downloadSubscription: Subscription
  saveDataQueryModalSubscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit(): void {
    this.canDownload()
  }

  public upload(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files[0]
    this.uploadService.uploadCRTDL(file)
  }

  private canDownload(): void {
    this.downloadAllowed$ = this.feasibilityQueryValidationService
      .getIsFeasibilityQueryValid()
      .pipe(map((isValid) => isValid && this.showDownload))
  }

  public downloadCRTDL(): void {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.autoFocus = true
    this.downloadSubscription?.unsubscribe()
    this.downloadSubscription = this.dialog
      .open(DownloadCRTDLComponent, dialogConfig)
      .afterClosed()
      .subscribe((isCancelled: boolean) => {})
  }

  public onSaveDataQuery(): void {
    this.saveDataQueryModalSubscription?.unsubscribe()
    this.saveDataQueryModalSubscription = this.saveDataQueryModalService
      .openSaveDataQueryModal()
      .subscribe()
  }
}
