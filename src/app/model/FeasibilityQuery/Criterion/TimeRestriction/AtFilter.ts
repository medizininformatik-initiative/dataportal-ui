import { TimeRestrictionType } from '../../TimeRestriction'
import { AbstractTimeRestriction } from './AbstractTimeRestriction'

export class AtFilter extends AbstractTimeRestriction {
  public afterDate: string
  public beforeDate: string
  protected readonly type: TimeRestrictionType = TimeRestrictionType.AT

  constructor(afterDate: string, beforeDate: string) {
    super(afterDate)
    this.afterDate = afterDate
    this.beforeDate = beforeDate
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
   * Gets the date before which the restriction applies.
   *
   * @returns {string} The before date.
   */
  public getBeforeDate(): string {
    return this.beforeDate
  }

  /**
   * Sets the date before which the restriction applies.
   *
   * @param {string} beforeDate - The before date to set.
   */
  public setBeforeDate(beforeDate: string): void {
    this.beforeDate = beforeDate
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
