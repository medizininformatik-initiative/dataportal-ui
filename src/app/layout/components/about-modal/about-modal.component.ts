import { AboutInfoBuilderService } from 'src/app/service/AboutInfo/AboutInfoBuilder.service'
import { AboutInfoData } from 'src/app/model/Interface/AboutInfo/AboutInfoData'
import { Component, OnInit, inject } from '@angular/core'
import { DownloadAboutInfoService } from 'src/app/service/Download/DownloadAboutInfo.service'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalWindowComponent } from '../../../shared/components/modal-window/modal-window.component'
import { InfoTileComponent } from '../../../shared/components/info-tile/info-tile.component'
import { ButtonComponent } from '../../../shared/components/button/button.component'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.scss'],
  standalone: true,
  imports: [ModalWindowComponent, InfoTileComponent, ButtonComponent, MatTooltip, TranslateModule],
})
export class AboutModalComponent implements OnInit {
  private readonly aboutInfoBuilder = inject(AboutInfoBuilderService)
  private readonly downloadAboutInfoService = inject(DownloadAboutInfoService)
  private readonly dialogRef = inject<MatDialogRef<AboutModalComponent>>(MatDialogRef)

  aboutInfo: AboutInfoData

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit() {
    this.aboutInfo = this.aboutInfoBuilder.buildAboutInfo()
  }

  public downloadAboutInfo(): void {
    this.downloadAboutInfoService.download()
  }

  public closeModal(): void {
    this.dialogRef.close()
  }
}
