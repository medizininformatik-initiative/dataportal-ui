import { ActuatorInformationService } from 'src/app/service/Actuator/ActuatorInformation.service';
import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service';
import { Component, OnInit } from '@angular/core';
import { DownloadAboutInfoService } from 'src/app/service/Download/DownloadAboutInfo.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'num-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.scss'],
})
export class AboutModalComponent implements OnInit {
  actuatorInfo$: Observable<any>;
  text: any;
  legalVersion: string;
  legalCopyrightOwner: string;
  legalCopyrightYear: string;
  legalEmail: string;
  backendBuildTime: string;

  constructor(
    private actuatorInformationService: ActuatorInformationService,
    private appSettingsProviderService: AppSettingsProviderService,
    private downloadAboutInfoService: DownloadAboutInfoService,
    private dialogRef: MatDialogRef<AboutModalComponent>
  ) {}

  ngOnInit() {
    this.getActuatorInfo();
  }

  public getActuatorInfo() {
    const cachedInfo = this.actuatorInformationService.getActuatorInfoValue();
    if (cachedInfo) {
      this.text = cachedInfo;
      this.backendBuildTime = new Date(cachedInfo.git?.build?.time).toLocaleString();
    }
    this.legalVersion = this.appSettingsProviderService.getVersion();
    this.legalCopyrightOwner = this.appSettingsProviderService.getCopyrightOwner();
    this.legalCopyrightYear = this.appSettingsProviderService.getCopyrightYear();
    this.legalEmail = this.appSettingsProviderService.getEmail();
  }

  public downloadAboutInfo(): void {
    this.downloadAboutInfoService.download();
  }

  public closeModal(): void {
    this.dialogRef.close();
  }
}
