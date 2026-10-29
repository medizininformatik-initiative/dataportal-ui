import { TimeRestrictionType } from '../../TimeRestriction'
import { AbstractTimeRestriction } from './AbstractTimeRestriction'

export class BeforeFilter extends AbstractTimeRestriction {
  public afterDate: string
  protected readonly type: TimeRestrictionType = TimeRestrictionType.BEFORE

  constructor(afterDate: string) {
    super(afterDate)
    this.afterDate = afterDate
  }

  /**
   * Returns the type of this time restriction.
   *
   * @returns {TimeRestrictionType} TimeRestrictionType
   */
  public getType() {
    return this.type
  }
}
