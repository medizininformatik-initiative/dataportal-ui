import { Injectable } from '@angular/core';
import { AbstractDownloadService } from './AbstractDownload.service';
import { AppSettingsProviderService } from '../Config/AppSettingsProvider.service';
import { ActuatorInformationService } from '../Actuator/ActuatorInformation.service';

export interface AboutInfo {
  timestamp: string
  ui: {
    version: string
    copyright: string
    email: string
  }
  backend: {
    version?: string
    buildTime?: string
    branch?: string
    commit?: string
    fullCommit?: string
  }
  ontology: {
    version?: string
  }
}

@Injectable({
  providedIn: 'root',
})
export class DownloadAboutInfoService extends AbstractDownloadService {
  constructor(
    private readonly actuatorInformationService: ActuatorInformationService,
    private readonly appSettingsProviderService: AppSettingsProviderService
  ) {
    super();
  }

  /**
   * Downloads the about information as a JSON file using data from providers.
   * @param filename - Optional custom filename (without extension)
   */
  public download(filename?: string): void {
    const aboutInfo = this.createAboutInfo();
    const finalFilename = this.createFilename(filename, 'about-info', 'iso');
    const blob = this.createJsonBlob(aboutInfo);
    this.triggerDownload(blob, `${finalFilename}.json`);
  }

  /**
   * Creates the AboutInfo object from cached provider data.
   * @returns The AboutInfo object
   * @private
   */
  private createAboutInfo(): AboutInfo {
    const actuatorInfo = this.actuatorInformationService.getActuatorInfoValue();
    const backendBuildTime = actuatorInfo?.git?.build?.time
      ? new Date(actuatorInfo.git.build.time).toLocaleString()
      : '';

    return {
      timestamp: new Date().toISOString(),
      ui: {
        version: this.appSettingsProviderService.getVersion(),
        copyright: `${this.appSettingsProviderService.getCopyrightOwner()} @${this.appSettingsProviderService.getCopyrightYear()}`,
        email: this.appSettingsProviderService.getEmail(),
      },
      backend: {
        version: actuatorInfo?.git?.build?.version,
        buildTime: backendBuildTime,
        branch: actuatorInfo?.git?.branch,
        commit: actuatorInfo?.git?.commit?.id?.abbrev,
        fullCommit: actuatorInfo?.git?.commit?.id?.full,
      },
      ontology: {
        version: actuatorInfo?.terminology?.ontologyTag,
      },
    };
  }
}
