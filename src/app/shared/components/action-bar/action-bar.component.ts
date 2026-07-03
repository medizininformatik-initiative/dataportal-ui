import { Component, computed, effect, inject, input } from '@angular/core'
import { DataDefinitionValidationService } from 'src/app/service/Validation/DataDefinitionValidation.service'
import { DownloadCRTDLComponent } from '../download-crtdl/download-crtdl.component'
import { FeasibilityQueryValidationService } from 'src/app/service/Criterion/Validation/FeasibilityQueryValidationService.service'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { MatTooltip } from '@angular/material/tooltip'
import { SaveDataQueryModalService } from 'src/app/service/SaveDataQueryModal.service'
import { TranslateModule } from '@ngx-translate/core'
import { UploadService } from 'src/app/service/Upload/Upload.service'
import { ValidationModalComponent } from '../validation-modal/validation-modal.component'

@Component({
  selector: 'num-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
  standalone: true,
  imports: [MatTooltip, FontAwesomeModule, TranslateModule],
})
export class ActionBarComponent {
  private dialog = inject(MatDialog)
  private saveDataQueryModalService = inject(SaveDataQueryModalService)
  private uploadService = inject(UploadService)
  private feasibilityQueryValidationService = inject(FeasibilityQueryValidationService)
  private readonly dataDefinitionValidationService = inject(DataDefinitionValidationService)
  private readonly matDialog = inject(MatDialog)

  readonly showUpload = input(true)
  readonly showDownload = input(true)
  readonly showSave = input(true)

  readonly downloadAllowed = computed(() => {
    return this.feasibilityQueryValidationService.isFeasibilityQueryValid() && this.showDownload()
  })

  readonly isDataDefinitionValid = computed(() =>
    this.dataDefinitionValidationService.isDataDefinitionValid()
  )

  constructor() {}

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

  public openValidationModal(): void {
    this.matDialog.open(ValidationModalComponent)
  }
}
