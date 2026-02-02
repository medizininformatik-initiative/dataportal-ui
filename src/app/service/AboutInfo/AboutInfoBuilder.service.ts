import { AboutInfoData } from 'src/app/model/Interface/AboutInfo/AboutInfoData';
import { ActuatorInformationService } from '../Actuator/ActuatorInformation.service';
import { AppSettingsProviderService } from '../Config/AppSettingsProvider.service';
import { BackendInfoData } from 'src/app/model/Interface/AboutInfo/BakcendInfoData';
import { GitInformationData } from 'src/app/model/Interface/ActuatorInfoData/GitData/GitInformationData';
import { Injectable } from '@angular/core';
import { UiInfoData } from 'src/app/model/Interface/AboutInfo/UiInfoData';

/**
 * Service responsible for building the about information data structure.
 * Aggregates data from various sources (UI settings, actuator, ontology) into a unified format.
 */
@Injectable({
  providedIn: 'root',
})
export class AboutInfoBuilderService {
  constructor(
    private readonly actuatorInformationService: ActuatorInformationService,
    private readonly appSettingsProviderService: AppSettingsProviderService
  ) {}

  /**
   * Creates a complete AboutInfo object from all available data sources.
   * @returns The complete about information data structure
   */
  public buildAboutInfo(): AboutInfoData {
    const actuatorInfo = this.actuatorInformationService.getActuatorInfoValue();
    return {
      timestamp: new Date().toISOString(),
      ui: this.buildUiInfo(),
      backend: this.buildBackendInfo(actuatorInfo.git),
      ontology: {
        version: actuatorInfo?.terminology?.ontologyTag,
      },
    };
  }

  /**
   * Builds the UI information object from app settings.
   * @returns The UI information data
   * @private
   */
  private buildUiInfo(): UiInfoData {
    return {
      version: this.appSettingsProviderService.getVersion(),
      copyright: `${this.appSettingsProviderService.getCopyrightOwner()} @${this.appSettingsProviderService.getCopyrightYear()}`,
      email: this.appSettingsProviderService.getEmail(),
    };
  }

  /**
   * Builds the backend information object from Git data.
   * @param gitInformation - The Git information data from the actuator
   * @returns The backend information data
   * @private
   */
  private buildBackendInfo(gitInformation: GitInformationData): BackendInfoData {
    const backendBuildTime = this.buildBackendBuildTime(gitInformation);
    return {
      version: gitInformation?.build?.version,
      buildTime: backendBuildTime,
      branch: gitInformation?.branch,
      commit: gitInformation?.commit?.id?.abbrev,
      fullCommit: gitInformation?.commit?.id?.full,
    };
  }

  /**
   * Formats the backend build time as a localized string.
   * @param - The Git information data containing build time
   * @returns The formatted build time string, or empty string if not available
   * @private
   */
  private buildBackendBuildTime(gitInformation: GitInformationData): string {
    return gitInformation?.build?.time ? new Date(gitInformation.build.time).toLocaleString() : '';
  }
}
