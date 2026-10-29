import { AbstractListEntry } from './AbstractListEntry'

export class FeasibilityQueryResultDetailstListEntry extends AbstractListEntry {
  private readonly numberOfPatients: number
  private readonly siteName: string

  constructor(numberOfPatients: number, siteName: string) {
    super(siteName)
    this.numberOfPatients = numberOfPatients
    this.siteName = siteName
  }

  /**
   * Gets the number of patients.
   * @returns {number} The number of patients.
   */
  public getNumberOfPatients(): number {
    return this.numberOfPatients
  }

  /**
   * Gets the site name.
   * @returns {string} The site name.
   */
  public getSiteName(): string {
    return this.siteName
  }
}
