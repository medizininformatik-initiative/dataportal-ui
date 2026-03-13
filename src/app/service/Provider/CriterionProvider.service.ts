import { AbstractArrayEntityProvider } from './Abstract/AbstractArrayEntityProvider';
import { Criterion } from '../../model/FeasibilityQuery/Criterion/Criterion';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CriterionProviderService extends AbstractArrayEntityProvider<Criterion> {
  constructor() {
    super();
  }

  /**
   * Returns the unique identifier for a given Criterion.
   * @param criterion
   * @returns
   */
  protected selectId(criterion: Criterion): string {
    return criterion.getId();
  }
}
