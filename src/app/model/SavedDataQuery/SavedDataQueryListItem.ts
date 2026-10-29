import { SavedDataQueryListItemData } from '../Interface/SavedDataQueryListItemData'

export class SavedDataQueryListItem {
  private id: number
  private label: string
  private createdAt: string
  private totalNumberOfResults?: number
  private comment: string
  private ccdl: {
    exists: boolean
    isValid: boolean
  }
  private dataSelection: {
    exists: boolean
    isValid: boolean
  }
  /**
   * Creates a new SavedDataQueryListItem.
   *
   * @param {number} id
   * @param {string} label
   * @param {string} comment
   * @param {string} createdAt
   * @param {{ exists: boolean; isValid: boolean }} ccdl
   * @param {{ exists: boolean; isValid: boolean }} ccdl.exists
   * @param {{ exists: boolean; isValid: boolean }} ccdl.isValid
   * @param {{ exists: boolean; isValid: boolean }} dataSelection
   * @param {{ exists: boolean; isValid: boolean }} dataSelection.exists
   * @param {{ exists: boolean; isValid: boolean }} dataSelection.isValid
   * @param {number} totalNumberOfResults
   */
  constructor(
    id: number,
    label: string,
    comment: string,
    createdAt: string,
    ccdl: { exists: boolean; isValid: boolean },
    dataSelection: { exists: boolean; isValid: boolean },
    totalNumberOfResults?: number
  ) {
    this.id = id
    this.label = label
    this.comment = comment
    this.createdAt = createdAt
    this.totalNumberOfResults = totalNumberOfResults
    this.ccdl = ccdl
    this.dataSelection = dataSelection
  }

  public getComment(): string {
    return this.comment
  }

  public setComment(comment: string): void {
    this.comment = comment
  }

  public getId(): number {
    return this.id
  }

  public setId(value: number): void {
    this.id = value
  }

  public setLabel(label: string): void {
    this.label = label
  }

  public getLabel(): string {
    return this.label
  }

  public getCreatedAt(): string {
    return this.createdAt
  }

  public setCreatedAt(value: string): void {
    this.createdAt = value
  }

  public getTotalNumberOfResults(): number | undefined {
    return this.totalNumberOfResults
  }

  public setTotalNumberOfResults(value: number): void {
    this.totalNumberOfResults = value
  }

  /**
   * Returns the ccdl.
   *
   * @returns {{ exists: boolean; isValid: boolean }}
   */
  public getCcdl(): { exists: boolean; isValid: boolean } {
    return this.ccdl
  }

  /**
   * Sets the ccdl.
   *
   * @param {{ exists: boolean; isValid: boolean }} value
   * @param {{ exists: boolean; isValid: boolean }} value.exists
   * @param {{ exists: boolean; isValid: boolean }} value.isValid
   */
  public setCcdl(value: { exists: boolean; isValid: boolean }): void {
    this.ccdl = value
  }

  /**
   * Returns the data selection.
   *
   * @returns {{ exists: boolean; isValid: boolean }}
   */
  public getDataSelection(): { exists: boolean; isValid: boolean } {
    return this.dataSelection
  }

  /**
   * Sets the data selection.
   *
   * @param {{ exists: boolean; isValid: boolean }} value
   * @param {{ exists: boolean; isValid: boolean }} value.exists
   * @param {{ exists: boolean; isValid: boolean }} value.isValid
   */
  public setDataSelection(value: { exists: boolean; isValid: boolean }): void {
    this.dataSelection = value
  }

  public static fromJson(json: SavedDataQueryListItemData): SavedDataQueryListItem {
    return new SavedDataQueryListItem(json.id, json.label, json.comment, json.lastModified, json.ccdl, json.dataExtraction, json.resultSize)
  }
}
