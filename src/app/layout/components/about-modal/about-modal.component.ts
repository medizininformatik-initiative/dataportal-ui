import { AboutInfoBuilderService } from 'src/app/service/AboutInfo/AboutInfoBuilder.service';
import { AboutInfoData } from 'src/app/model/Interface/AboutInfo/AboutInfoData';
import { Component, OnInit } from '@angular/core';
import { DownloadAboutInfoService } from 'src/app/service/Download/DownloadAboutInfo.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'num-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.scss'],
})
export class AboutModalComponent implements OnInit {
  aboutInfo: AboutInfoData;

  constructor(
    private readonly aboutInfoBuilder: AboutInfoBuilderService,
    private readonly downloadAboutInfoService: DownloadAboutInfoService,
    private readonly dialogRef: MatDialogRef<AboutModalComponent>
  ) {}

  ngOnInit() {
    this.aboutInfo = this.aboutInfoBuilder.buildAboutInfo();
  }

  public downloadAboutInfo(): void {
    this.downloadAboutInfoService.download();
  }

  public closeModal(): void {
    this.dialogRef.close();
  }
}
