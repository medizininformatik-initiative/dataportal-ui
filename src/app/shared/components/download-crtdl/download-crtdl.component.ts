import { AnnotatedStructuredQuery } from 'src/app/model/AnnotatedStructuredQuery/AnnotatedStructuredQuery'
import { Component, inject } from '@angular/core'
import { DownloadCRTDLService } from 'src/app/service/Download/DownloadCRTDL.service'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SaveFileDataModal } from '../../models/SaveDataModal/SaveFileDataModal'
import { SaveQueryModalComponent } from 'src/app/modules/feasibility-query/components/result/save-dialog/save-dialog.component'
import { SaveFileModalComponent } from '../save-file-modal/save-file-modal.component'
import { HeaderComponent } from '../header/header.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-download-crtdl',
  templateUrl: './download-crtdl.component.html',
  styleUrls: ['./download-crtdl.component.scss'],
  standalone: true,
  imports: [SaveFileModalComponent, HeaderComponent, TranslateModule],
})
export class DownloadCRTDLComponent {
  private dialogRef = inject<MatDialogRef<SaveQueryModalComponent, void>>(MatDialogRef)
  annotatedStructuredQuery = inject<AnnotatedStructuredQuery>(MAT_DIALOG_DATA)
  private downloadCRTDLService = inject(DownloadCRTDLService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public downloadCRTDL(data: SaveFileDataModal) {
    this.downloadCRTDLService.download(data.title)
    this.doDiscard()
  }

  public doDiscard(): void {
    this.dialogRef.close()
  }
}
