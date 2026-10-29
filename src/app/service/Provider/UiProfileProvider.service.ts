import { Injectable } from '@angular/core'
import { UiProfileData } from 'src/app/model/Interface/UiProfileData'
import { AbstractArrayEntityProvider } from './Abstract/AbstractArrayEntityProvider'

@Injectable({
  providedIn: 'root',
})
export class UiProfileProviderService extends AbstractArrayEntityProvider<UiProfileData> {
  constructor() {
    super()
  }

  /**
   * Returns the unique identifier for a given UI profile response entity.
   * @param {UiProfileData} entity
   * @returns {string}
   */
  protected selectId(entity: UiProfileData): string {
    return entity.name
  }
}
