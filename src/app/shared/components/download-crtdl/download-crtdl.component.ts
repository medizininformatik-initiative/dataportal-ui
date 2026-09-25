import { ButtonComponent } from '../shared-components.module'
import { Component, inject } from '@angular/core'
import { DownloadCRTDLService } from 'src/app/service/Download/DownloadCRTDL.service'
import { DownloadCRTDLZipService } from 'src/app/service/Download/DownloadCRTDLZip.service'
import { HeaderComponent } from '../header/header.component'
import { MatDialogRef } from '@angular/material/dialog'
import { SaveFileModalComponent } from '../save-file-modal/save-file-modal.component'
import { TranslateModule } from '@ngx-translate/core'

export type DownloadCRTDLFormat = 'crtdl' | 'csv'

@Component({
  selector: 'num-download-crtdl',
  templateUrl: './download-crtdl.component.html',
  styleUrls: ['./download-crtdl.component.scss'],
  standalone: true,
  imports: [SaveFileModalComponent, HeaderComponent, TranslateModule, ButtonComponent],
})
export class DownloadCRTDLComponent {
  private dialogRef = inject(MatDialogRef)
  private downloadCRTDLService = inject(DownloadCRTDLService)
  private downloadCRTDLZipService = inject(DownloadCRTDLZipService)

  public selectedFormat: DownloadCRTDLFormat = 'crtdl'

  constructor() {}

  public download(title: string): void {
    if (this.selectedFormat === 'crtdl') {
      this.downloadCRTDLService.download(title)
    } else {
      this.downloadCRTDLZipService.download(title)
    }
    this.doDiscard()
  }

  public doDiscard(): void {
    this.dialogRef.close()
  }
}
