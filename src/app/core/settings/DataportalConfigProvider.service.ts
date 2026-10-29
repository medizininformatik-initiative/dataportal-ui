import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { DataportalConfigData } from 'src/app/config/model/DataPortalConfig/DataportalConfigData'
import { DataportalConfigKey } from 'src/app/config/model/DataPortalConfig/DataportalConfigKey'
import { DataportalConfigValue } from 'src/app/config/model/DataPortalConfig/DataportalConfigValue'

@Injectable({
  providedIn: 'root',
})
export class DataportalConfigProviderService {
  private settingsMap = new Map<DataportalConfigKey, DataportalConfigValue<DataportalConfigKey>>()
  private readonly settingsMapSubject = new BehaviorSubject(new Map<DataportalConfigKey, DataportalConfigValue<DataportalConfigKey>>())
  private locked = false

  /**
   * Get the settings map as an observable.
   * @returns {Observable< Map<DataportalConfigKey, DataportalConfigValue<DataportalConfigKey>> >}
   */
  public getSettingsMap(): Observable<Map<DataportalConfigKey, DataportalConfigValue<DataportalConfigKey>>> {
    return this.settingsMapSubject.asObservable()
  }

  /**
   * Get a specific setting by key.
   * @param {K} key
   * @returns {DataportalConfigValue<K> | undefined}
   */
  public getSettingByKey<K extends DataportalConfigKey>(key: K): DataportalConfigValue<K> | undefined {
    return this.settingsMap.get(key) as DataportalConfigValue<K> | undefined
  }

  /**
   * Set the settings map once.
   * @param {DataportalConfigData} appConfig
   */
  public setDataportalConfig(appConfig: DataportalConfigData): void {
    if (this.locked) {
      console.warn('[SettingsProviderService] Attempt to overwrite locked settings ignored.')
      return
    }
    const appConfigMap = new Map(Object.entries(appConfig) as [DataportalConfigKey, DataportalConfigValue<DataportalConfigKey>][])
    this.settingsMap = appConfigMap
    this.settingsMapSubject.next(appConfigMap)
    this.locked = true
  }

  /**
   * Sets the setting by key.
   * @see DataportalSettings
   * Set a single setting value by key.
   * @param {K} key
   * @param {DataportalConfigValue<K>} value
   */
  public setSettingByKey<K extends DataportalConfigKey>(key: K, value: DataportalConfigValue<K>): void {
    if (this.locked && this.settingsMap.has(key)) {
      console.warn(`[SettingsProviderService] Attempt to overwrite existing setting "${key}" ignored.`)
      return
    }
    this.settingsMap.set(key, value)
    this.settingsMapSubject.next(new Map(this.settingsMap))
  }
}
