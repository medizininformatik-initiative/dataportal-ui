import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { Availability } from '../../Availability/Availability'
import { AvailabilityStatusType } from '../../Availability/AvailabilityStatusType'
import { CriteriaListEntryData } from '../../Interface/Search/CriteriaListListEntryData'
import { AbstractListEntry } from './AbstractListEntry'

/**
 * Represents a criteria list item, extending AbstractSearchResult.
 */
export class CriteriaListEntry extends AbstractListEntry {
  private readonly selectable: boolean
  private readonly availability: number
  private readonly terminology: string
  private readonly termcode: string
  private readonly kdsModule: string
  private readonly context: string
  private readonly display: Display
  constructor(
    availability: number,
    selectable: boolean,
    terminology: string,
    termcode: string,
    kdsModule: string,
    display: Display,
    id: string,
    context: string
  ) {
    super(id)
    this.availability = availability
    this.terminology = terminology
    this.termcode = termcode
    this.kdsModule = kdsModule
    this.selectable = selectable
    this.display = display
    this.context = context
  }

  /**
   * Returns the selectable.
   *
   * @returns {boolean} if the Item is selectable
   */
  public getSelectable() {
    return this.selectable
  }

  /**
   * Gets the availability of the searchterm.
   *
   * @returns {number} The availability as a number.
   */
  public getAvailability(): number {
    return this.availability
  }

  public getAvailabilityStatus(): AvailabilityStatusType {
    return new Availability(this.availability).getStatus()
  }

  /**
   * Gets the terminology of the searchterm.
   *
   * @returns {string} The terminology as a string.
   */
  public getTerminology(): string {
    return this.terminology
  }

  /**
   * Gets the term code of the searchterm.
   *
   * @returns {string} The term code as a string.
   */
  public getTermcode(): string {
    return this.termcode
  }

  /**
   * Gets the KDS module.
   *
   * @returns {string} The KDS module as a string.
   */
  public getKdsModule(): string {
    return this.kdsModule
  }

  public getDisplay(): Display {
    return this.display
  }

  public getContext(): string {
    return this.context
  }

  /**
   * Creates a new instance of CriteriaListEntry from JSON.
   * @param {CriteriaListEntryData} json The JSON object to convert.
   * @returns {CriteriaListEntry} A new instance of CriteriaListEntry.
   */
  public static fromJson(json: CriteriaListEntryData): CriteriaListEntry {
    return new CriteriaListEntry(
      json.availability,
      json.selectable,
      json.terminology,
      json.termcode,
      json.kdsModule,
      Display.fromJson(json.display),
      json.id,
      json.context
    )
  }
}
