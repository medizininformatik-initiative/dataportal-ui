import { Injectable } from '@angular/core';
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion';
import { AbstractArrayEntityProvider } from './Abstract/AbstractArrayEntityProvider';

@Injectable({
  providedIn: 'root',
})
export class ReferenceCriterionProviderService extends AbstractArrayEntityProvider<ReferenceCriterion> {
  constructor() {
    super();
  }

  /**
   * Returns the unique identifier for a given ReferenceCriterion.
   * @param referenceCriterion
   * @returns
   */
  protected selectId(referenceCriterion: ReferenceCriterion): string {
    return referenceCriterion.getId();
  }
}
