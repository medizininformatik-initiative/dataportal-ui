import * as iso8601 from 'iso8601-duration';
import { AppConfigKey } from 'src/app/config/model/AppConfig/AppConfigKey';
import { AppConfigProviderService } from 'src/app/core/settings/AppConfigProvider.service';
import { AppConfigValue } from 'src/app/config/model/AppConfig/AppConfigValue';
import { AppSettingGetter } from './AppSettingGetterType';
import { DataportalConfigKey } from 'src/app/config/model/DataPortalConfig/DataportalConfigKey';
import { DataportalConfigProviderService } from '../../core/settings/DataportalConfigProvider.service';
import { DataportalConfigValue } from 'src/app/config/model/DataPortalConfig/DataportalConfigValue';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppSettingsProviderService implements AppSettingGetter {
  constructor(
    private readonly settingsProvider: DataportalConfigProviderService,
    private readonly appConfigProvider: AppConfigProviderService
  ) {}

  /**
   * Gets a specific setting by key using the settings provider
   * @param key The setting key to retrieve
   * @returns The setting value or undefined if not found
   */
  private getDataPortalConfigByKey<K extends DataportalConfigKey>(
    key: K
  ): DataportalConfigValue<K> | undefined {
    return this.settingsProvider.getSettingByKey(key);
  }

  /**
   * Gets a specific AppConfig setting by key
   * @param key The AppConfig setting key to retrieve
   * @returns The setting value or undefined if not found
   */
  private getAppConfigSettingByKey<K extends AppConfigKey>(key: K): AppConfigValue<K> | undefined {
    return this.appConfigProvider.getSettingByKey(key);
  }

  /**
   * Gets the base URL for the application
   */
  public getBaseUrl(): string {
    return this.getAppConfigSettingByKey('baseUrl') ?? '';
  }

  /**
   * Gets the authentication base URL
   */
  public getAuthBaseUrl(): string {
    return this.getAppConfigSettingByKey('authBaseUrl');
  }

  /**
   * Gets the authentication realm
   */
  public getAuthRealm(): string {
    return this.getAppConfigSettingByKey('authRealm');
  }

  /**
   * Gets the authentication client ID
   */
  public getAuthClientId(): string {
    return this.getAppConfigSettingByKey('authClientId');
  }

  /**
   * Gets the legal version
   */
  public getVersion(): string {
    return this.getAppConfigSettingByKey('version') ?? '';
  }

  /**
   * Gets the copyright year
   */
  public getCopyrightYear(): string {
    return this.getAppConfigSettingByKey('copyrightYear') ?? '';
  }

  /**
   * Gets the copyright owner
   */
  public getCopyrightOwner(): string {
    return this.getAppConfigSettingByKey('copyrightOwner') ?? '';
  }

  /**
   * Gets the legal contact email
   */
  public getEmail(): string {
    return this.getAppConfigSettingByKey('email') ?? '';
  }

  /**
   * Gets the proposal portal link URL
   */
  public getPortalLink(): string {
    return this.getDataPortalConfigByKey('passthroughPortalLink') ?? '';
  }

  /**
   * Gets the UI backend API URL
   */
  public getUiBackendApiPath(): string {
    return this.getDataPortalConfigByKey('uiBackendApiPath') ?? '';
  }

  /**
   * Gets the DSE patient profile URL
   */
  public getDsePatientProfileUrl(): string {
    return this.getDataPortalConfigByKey('passthroughDsePatientProfileUrl') ?? '';
  }

  /**
   * Gets the polling interval configuration
   */
  public getSummaryPollingInterval(): number {
    const duration = iso8601.parse(
      this.getDataPortalConfigByKey('readResultSummaryPollingInterval')
    );
    return iso8601.toSeconds(duration);
  }

  /**
   * Gets the polling time configuration in milliseconds and parsed according to iso8601
   */
  public getPollingTimeUi(): number {
    const duration = iso8601.parse(this.getDataPortalConfigByKey('passthroughPollingTimeUi'));
    return iso8601.toSeconds(duration);
  }

  /**
   * Gets the CCDL version
   */
  public getCcdlVersion(): string {
    return this.getDataPortalConfigByKey('passthroughCcdlVersion');
  }

  /** Gets the backend base URL
   */
  public getBackendBaseUrl(): string {
    return this.getAppConfigSettingByKey('backendBaseUrl') ?? '';
  }

  /**
   * Gets the configured stylesheet or an empty string if not set
   * @returns The configured stylesheet or an empty string if not set
   */
  public getStylesheet(): string | undefined {
    return this.getAppConfigSettingByKey('stylesheet');
  }

  /**
   *
   * @returns number
   */
  public getResultDetailedObfuscatedInterval(): number {
    const duration = iso8601.parse(
      this.getDataPortalConfigByKey('readResultDetailedObfuscatedInterval')
    );
    return iso8601.toSeconds(duration);
  }

  /**
   *
   * @returns
   */
  public getResultDetailedObfuscatedAmount(): number {
    const duration = iso8601.parse(
      this.getDataPortalConfigByKey('readResultDetailedObfuscatedAmount')
    );
    return iso8601.toSeconds(duration);
  }

  /**
   *
   * @returns
   */
  public getResultDetailedObfuscatedPollingInterval(): number {
    const duration = iso8601.parse(
      this.getDataPortalConfigByKey('readResultDetailedObfuscatedPollingInterval')
    );
    return iso8601.toSeconds(duration);
  }

  /**
   *
   * @returns
   */
  public getResultSummaryPollingInterval(): number {
    const duration = iso8601.parse(
      this.getDataPortalConfigByKey('readResultSummaryPollingInterval')
    );
    return iso8601.toSeconds(duration);
  }

  public getMaxSavedQueriesPerUser(): number {
    return this.getDataPortalConfigByKey('maxSavedQueriesPerUser');
  }

  public getQueryResultExpiry(): number {
    const duration = iso8601.parse(this.getDataPortalConfigByKey('queryResultExpiry'));
    return iso8601.toSeconds(duration);
  }
}
