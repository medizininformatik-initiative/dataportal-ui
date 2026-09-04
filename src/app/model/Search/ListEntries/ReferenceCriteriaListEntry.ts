import { AbstractListEntry } from './AbstractListEntry'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { ReferenceCriteriaListEntryData } from '../../Interface/Search/ReferenceCriteriaListEntryData'

export class ReferenceCriteriaListEntry extends AbstractListEntry {
  private readonly display: Display
  private readonly system: string
  private readonly termcode: string
  private readonly terminology: string

  /**
   * @param terminology
   * @param id
   */
  constructor(display: Display, system: string, termcode: string, terminology: string, id: string) {
    super(id)
    this.display = display
    this.system = system
    this.termcode = termcode
    this.terminology = terminology
  }

  public getDisplay(): Display {
    return this.display
  }

  public getTerminology(): string {
    return this.terminology
  }

  public getSystem(): string {
    return this.system
  }

  public getTermcode(): string {
    return this.termcode
  }

  /**
   * Creates a new instance of ReferenceCriteriaListEntry from JSON.
   * @param json The JSON object to convert.
   * @returns A new instance of ReferenceCriteriaListEntry.
   */
  public static fromJson(json: ReferenceCriteriaListEntryData): ReferenceCriteriaListEntry {
    console.log(json)
    return new ReferenceCriteriaListEntry(
      Display.fromJson(json.display),
      json.system,
      json.termcode,
      json.terminology,
      json.id
    )
  }
}
