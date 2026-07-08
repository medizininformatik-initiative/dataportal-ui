import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { ProfileStateType } from 'src/app/service/Validation/Internal/DataSelectionValidation.service'

/**
 * List entry wrapping a ValidationContext from DataDefinitionValidationService.
 * Used in the Data Selection validation table.
 */
export class ProfileValidationEntry extends AbstractListEntry {
  protected id: string
  private readonly display: Display
  private readonly state: ProfileStateType
  private readonly valid: boolean
  private readonly profileId: string
  private readonly referenceFieldId?: string

  constructor(
    id: string,
    display: Display,
    state: ProfileStateType,
    valid: boolean,
    profileId: string,
    referenceFieldId?: string
  ) {
    super(id)
    this.id = id
    this.display = display
    this.state = state
    this.valid = valid
    this.profileId = profileId
    this.referenceFieldId = referenceFieldId
  }

  /**
   * Returns the display object of the profile.
   * @returns {Display}
   */
  public getDisplay(): Display {
    return this.display
  }

  /**
   * Returns whether the profile is valid or not.
   * @returns {boolean}
   */
  public getValid(): boolean {
    return this.valid
  }
  /**
   * Returns the validation state of the profile.
   * @returns {ProfileStateType}
   */
  public getState(): ProfileStateType {
    return this.state
  }

  /**
   * Returns the ID of the profile.
   * @returns {string}
   */
  public getProfileId(): string {
    return this.profileId
  }

  /**
   * Returns the ID of the entry.
   * @returns {string}
   */
  public getId(): string {
    return this.id
  }

  /**
   * Returns the ID of the reference field that is missing for the profile.
   * @returns {string | undefined}
   */
  public getReferenceFieldId(): string | undefined {
    return this.referenceFieldId
  }
}
