import { Injectable } from '@angular/core'
import { ConceptData } from 'src/app/model/Interface/ConceptData'
import { AbstractArrayEntityProvider } from '../Provider/Abstract/AbstractArrayEntityProvider'

@Injectable({
  providedIn: 'root',
})
export class ConceptTranslationCacheService extends AbstractArrayEntityProvider<ConceptData> {
  constructor() {
    super()
  }

  /**
   * Returns the ID of the concept data entity.
   * @param {ConceptData} entity
   * @returns {string} The ID of the concept data entity
   */
  protected selectId(entity: ConceptData): string {
    return entity.id
  }
}
