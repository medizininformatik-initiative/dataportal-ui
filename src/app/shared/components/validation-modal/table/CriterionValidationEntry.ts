import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'

/**
 * List entry representing a single criterion's validation state
 * for the Feasibility Query validation table.
 */
export class CriterionValidationEntry extends AbstractListEntry {
  protected id: string
  private readonly display: Display
  private readonly valid: boolean
  private readonly criterionId: string
  constructor(id: string, display: Display, valid: boolean, criterionId: string) {
    super(id)
    this.display = display
    this.valid = valid
    this.criterionId = criterionId
  }

  public getDisplay(): Display {
    return this.display
  }

  public isValid(): boolean {
    return this.valid
  }

  public getCriterionId(): string {
    return this.criterionId
  }
}
