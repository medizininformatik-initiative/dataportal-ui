/**
 * Abstract class for time restrictions in a structured query.
 *
 * @abstract
 */
export abstract class AbstractTimeRestriction {
  private afterDate?: string
  private beforeDate?: string

  /**
   * Constructor to initialize the AbstractTimeRestriction with attribute code, type, afterDate, and beforeDate.
   *
   * @param {string} afterDate - The date that marks the start of the time restriction.
   * @param {string} [beforeDate] - The date that marks the end of the time restriction.
   */
  constructor(afterDate?: string, beforeDate?: string) {
    this.afterDate = afterDate
    this.beforeDate = beforeDate
  }

  /**
   * Gets the afterDate value.
   *
   * @returns {string} The afterDate value.
   */
  public getAfterDate(): string {
    return this.afterDate
  }

  /**
   * Sets the afterDate value.
   *
   * @param {string} afterDate - The new afterDate value to set.
   */
  public setAfterDate(afterDate: string): void {
    this.afterDate = afterDate
  }

  /**
   * Gets the beforeDate value.
   *
   * @returns {string | undefined} The beforeDate value.
   */
  public getBeforeDate(): string | undefined {
    return this.beforeDate
  }

  /**
   * Sets the beforeDate value.
   *
   * @param {string} beforeDate - The new beforeDate value to set.
   */
  public setBeforeDate(beforeDate: string): void {
    this.beforeDate = beforeDate
  }
}
