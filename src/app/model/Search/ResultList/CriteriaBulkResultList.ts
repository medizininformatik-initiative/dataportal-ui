import { BulkSearchResponseData } from '../../Interface/BulkSearchResponseData'
import { BulkSearchResponseFoundData } from '../../Interface/BulkSearchResponseFoundData'
import { CriteriaBulkEntry } from '../ListEntries/CriteriaBulkEntry'
import { CriteriaBulkEntryNotFound } from '../ListEntries/CriteriaBulkEntryNotFound'

/**
 * Represents a result list for bulk criteria search operations.
 * Contains found entries, not found identifiers, and UI profile information.
 */
export class CriteriaBulkResultList {
  private found: CriteriaBulkEntry[]
  private notFound: CriteriaBulkEntryNotFound[]
  private uiProfileId: string

  /**
   * Creates a new CriteriaBulkResultList instance.
   * @param {CriteriaBulkEntry[]} found - Array of found criteria bulk entries
   * @param {CriteriaBulkEntryNotFound[]} notFound - Array of identifiers that were not found
   * @param {string} uiProfileId - The UI profile identifier
   */
  constructor(found: CriteriaBulkEntry[], notFound: CriteriaBulkEntryNotFound[], uiProfileId: string) {
    this.found = found
    this.notFound = notFound
    this.uiProfileId = uiProfileId
  }

  /**
   * Gets the array of found criteria bulk entries.
   * @returns {CriteriaBulkEntry[]} Array of found entries
   */
  public getFound(): CriteriaBulkEntry[] {
    return this.found
  }

  /**
   * Sets the array of found criteria bulk entries.
   * @param {CriteriaBulkEntry[]} found - Array of found entries to set
   */
  public setFound(found: CriteriaBulkEntry[]): void {
    this.found = found
  }

  /**
   * Gets the array of identifiers that were not found.
   * @returns {CriteriaBulkEntryNotFound[]} Array of not found identifiers
   */
  public getNotFound(): CriteriaBulkEntryNotFound[] {
    return this.notFound
  }

  /**
   * Sets the array of identifiers that were not found.
   * @param {CriteriaBulkEntryNotFound[]} notFound - Array of not found identifiers to set
   */
  public setNotFound(notFound: CriteriaBulkEntryNotFound[]): void {
    this.notFound = notFound
  }

  /**
   * Gets the UI profile identifier.
   * @returns {string} The UI profile ID
   */
  public getUiProfileId(): string {
    return this.uiProfileId
  }

  /**
   * Sets the UI profile identifier.
   * @param {string} uiProfileId - The UI profile ID to set
   */
  public setUiProfileId(uiProfileId: string): void {
    this.uiProfileId = uiProfileId
  }

  /**
   * Creates a CriteriaBulkResultList instance from JSON data.
   * @param {BulkSearchResponseData} json - The bulk search response data
   * @returns {CriteriaBulkResultList} A new CriteriaBulkResultList instance
   */
  public static fromJson(json: BulkSearchResponseData): CriteriaBulkResultList {
    const foundEntries: CriteriaBulkEntry[] = json.found.map((entry: BulkSearchResponseFoundData) => CriteriaBulkEntry.fromJson(entry))
    const notFoundEntries: CriteriaBulkEntryNotFound[] = json.notFound.map((entry: string) => new CriteriaBulkEntryNotFound(entry, entry))
    return new CriteriaBulkResultList(foundEntries, notFoundEntries, json.uiProfileId)
  }
}
