import { CriteriaRelativeData } from 'src/app/model/Interface/ListEntryDetailsData/CriteriaRelativeData'
import { Display } from '../../../DataSelection/Profile/Display'
import { TerminologySystemDictionary } from '../../../Utilities/TerminologySystemDictionary'
import { AbstractRelative } from '../AbstractRelative'

export class CriteriaEntryRelative extends AbstractRelative {
  private readonly selectable: boolean
  private readonly termcode: string
  private readonly terminology: string
  private readonly contextualizedTermcodeHash: string

  /**
   * Creates a new CriteriaEntryRelative.
   *
   * @param display
   * @param termcode
   * @param terminology
   * @param contextualizedTermcodeHash
   * @param selectable
   */
  constructor(display: Display, termcode: string, terminology: string, contextualizedTermcodeHash: string, selectable: boolean = true) {
    super(display)
    this.termcode = termcode
    this.terminology = terminology
    this.contextualizedTermcodeHash = contextualizedTermcodeHash
    this.selectable = selectable
  }

  public getSelectable(): boolean {
    return this.selectable
  }

  public getTermcode(): string {
    return this.termcode
  }

  public getTerminology(): string {
    return this.terminology
  }

  public getTranslatedTerminologyDisplay(): Display | string {
    const display = TerminologySystemDictionary.getNameByUrl(this.terminology)
    return display ? display : this.terminology
  }

  public getContextualizedTermcodeHash(): string {
    return this.contextualizedTermcodeHash
  }

  /**
   * Creates an instance from its JSON data.
   *
   * @param json
   */
  public static fromJson(json: CriteriaRelativeData): CriteriaEntryRelative {
    const display = Display.fromJson(json.display)
    return new CriteriaEntryRelative(display, json.termcode, json.terminology, json.contextualizedTermcodeHash, json.selectable)
  }
}
