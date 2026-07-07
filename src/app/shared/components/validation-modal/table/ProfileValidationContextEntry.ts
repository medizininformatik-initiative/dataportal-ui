import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { ValidationStateType } from 'src/app/service/Validation/DataSelectionValidation.service'

/**
 * List entry wrapping a ValidationContext from DataDefinitionValidationService.
 * Used in the Data Selection validation table.
 */
export class ProfileValidationEntry extends AbstractListEntry {
  protected id: string
  private readonly display: Display
  private readonly state: ValidationStateType
  private readonly valid: boolean
  private readonly profileId: string

  constructor(
    id: string,
    display: Display,
    state: ValidationStateType,
    valid: boolean,
    profileId: string
  ) {
    super(id)
    this.id = id
    this.display = display
    this.state = state
    this.valid = valid
    this.profileId = profileId
  }

  public getDisplay(): Display {
    return this.display
  }

  public getValid(): boolean {
    return this.valid
  }

  public getState(): ValidationStateType {
    return this.state
  }

  public getProfileId(): string {
    return this.profileId
  }

  public getId(): string {
    return this.id
  }
}
