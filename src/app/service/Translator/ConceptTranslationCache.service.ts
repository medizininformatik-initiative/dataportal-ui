import { ConceptData } from 'src/app/model/Interface/ConceptData';
import { Injectable } from '@angular/core';
import { AbstractArrayEntityProvider } from '../Provider/Abstract/AbstractArrayEntityProvider';

@Injectable({
  providedIn: 'root',
})
export class ConceptTranslationCacheService extends AbstractArrayEntityProvider<ConceptData> {
  constructor() {
    super();
  }

  /**
   * Returns the ID of the concept data entity.
   * @param entity
   * @returns The ID of the concept data entity
   */
  protected selectId(entity: ConceptData): string {
    return entity.hash;
  }
}
