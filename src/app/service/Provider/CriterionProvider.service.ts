import { Injectable } from '@angular/core'
import { Criterion } from '../../model/FeasibilityQuery/Criterion/Criterion'
import { AbstractArrayEntityProvider } from './Abstract/AbstractArrayEntityProvider'

@Injectable({
  providedIn: 'root',
})
export class CriterionProviderService extends AbstractArrayEntityProvider<Criterion> {
  constructor() {
    super()
  }

  /**
   * Returns the unique identifier for a given Criterion.
   * @param {Criterion} criterion
   * @returns {string}
   */
  protected selectId(criterion: Criterion): string {
    return criterion.getId()
  }
}
