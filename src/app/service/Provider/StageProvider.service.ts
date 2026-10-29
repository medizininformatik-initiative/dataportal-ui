import { Injectable } from '@angular/core'
import { AbstractArrayEntityProvider } from './Abstract/AbstractArrayEntityProvider'

@Injectable({
  providedIn: 'root',
})
export class StageProviderService extends AbstractArrayEntityProvider<string> {
  constructor() {
    super()
  }

  /**
   * Returns the id
   * @param {string} stageUID
   * @returns {string}
   */
  protected selectId(stageUID: string): string {
    return stageUID
  }
}
