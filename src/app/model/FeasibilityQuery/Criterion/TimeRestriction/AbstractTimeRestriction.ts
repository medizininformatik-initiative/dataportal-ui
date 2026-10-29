import { TimeRestrictionType } from '../../TimeRestriction'

/**
 * Abstract class representing a Time Restriction.
 */
export abstract class AbstractTimeRestriction {
  protected beforeDate?: string
  protected afterDate: string
  protected type: TimeRestrictionType

  /**
   * Creates an instance of AbstractTimeRestriction.
   *
   * @param {string} beforeDate - Date before which the restriction applies.
   * @param {string} afterDate - Date after which the restriction applies.
   * @param type - Type of time restriction.
   */
  constructor(afterDate: string, beforeDate?: string) {
    this.beforeDate = beforeDate
    this.afterDate = afterDate
  }

  /**
   * Gets the date before which the restriction applies.
   *
   * @returns {string | undefined} The before date.
   */
  public getBeforeDate(): string | undefined {
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
   * Gets the date after which the restriction applies.
   *
   * @returns {string | undefined} The after date.
   */
  public getAfterDate(): string | undefined {
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

  public abstract getType()
}
