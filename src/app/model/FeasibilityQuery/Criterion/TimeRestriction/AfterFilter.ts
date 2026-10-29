import { TimeRestrictionType } from '../../TimeRestriction'
import { AbstractTimeRestriction } from './AbstractTimeRestriction'

export class AfterFilter extends AbstractTimeRestriction {
  public afterDate: string
  protected readonly type: TimeRestrictionType = TimeRestrictionType.AFTER

  constructor(afterDate: string) {
    super(afterDate)
    this.afterDate = afterDate
  }

  /**
   * Gets the date after which the restriction applies.
   *
   * @returns {string} The after date.
   */
  public getAfterDate(): string {
    return this.afterDate
  }

  /**
   * Sets the date after which the restriction applies.
   *
   * @param {string} afterDate - The after date to set.
   */
  public setAfterDate(afterDate: string): void {
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
