import { Component, inject } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { TranslateModule } from '@ngx-translate/core'
import { DownloadCRTDLService } from 'src/app/service/Download/DownloadCRTDL.service'
import { DownloadCRTDLZipService } from 'src/app/service/Download/DownloadCRTDLZip.service'
import { NumDataCyDirective } from '../../directives/num-data-cy.directive'
import { ButtonComponent } from '../button/button.component'
import { HeaderComponent } from '../header/header.component'
import { SaveFileModalComponent } from '../save-file-modal/save-file-modal.component'

export type DownloadCRTDLFormat = 'crtdl' | 'csv'

@Component({
  selector: 'num-download-crtdl',
  templateUrl: './download-crtdl.component.html',
  styleUrls: ['./download-crtdl.component.scss'],
  standalone: true,
  imports: [SaveFileModalComponent, HeaderComponent, TranslateModule, ButtonComponent, NumDataCyDirective],
})
export class DownloadCRTDLComponent {
  private readonly dialogRef = inject(MatDialogRef)
  private readonly downloadCRTDLService = inject(DownloadCRTDLService)
  private readonly downloadCRTDLZipService = inject(DownloadCRTDLZipService)

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
