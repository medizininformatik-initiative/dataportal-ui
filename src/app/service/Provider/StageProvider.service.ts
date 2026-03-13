import { AbstractArrayEntityProvider } from './Abstract/AbstractArrayEntityProvider';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StageProviderService extends AbstractArrayEntityProvider<string> {
  constructor() {
    super();
  }

  /**
   * Returns the id
   * @param stageUID
   * @returns
   */
  protected selectId(stageUID: string): string {
    return stageUID;
  }
}
