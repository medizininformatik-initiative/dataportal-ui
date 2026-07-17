import { Display } from '../../../DataSelection/Profile/Display'
import { AbstractRelative } from '../AbstractRelative'
import { CriteriaRelativeData } from '../../../Interface/CriteriaRelativesData'
import { TerminologySystemDictionary } from '../../../Utilities/TerminologySystemDictionary'

export class CriteriaEntryRelatives extends AbstractRelative {
  private readonly selectable: boolean
  private readonly termcode: string
  private readonly terminology: string
  private readonly contextualizedTermcodeHash: string

  constructor(
    display: Display,
    termcode: string,
    terminology: string,
    contextualizedTermcodeHash: string,
    selectable: boolean = true
  ) {
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

  public static fromJson(json: CriteriaRelativeData): CriteriaEntryRelatives {
    const display = Display.fromJson(json.display)
    return new CriteriaEntryRelatives(
      display,
      json.termcode,
      json.terminology,
      json.contextualizedTermcodeHash,
      json.selectable
    )
  }
}
