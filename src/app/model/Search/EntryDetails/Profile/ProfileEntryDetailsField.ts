import { Display } from '../../../DataSelection/Profile/Display'
import { DisplayData } from '../../../Interface/DisplayData'

export interface ProfileEntryDetailsFieldData {
  display: DisplayData
  description: DisplayData
}

export class ProfileEntryDetailsField {
  private readonly display: Display
  private readonly description: Display

  constructor(display: Display, description: Display) {
    this.display = display
    this.description = description
  }

  public getDisplay(): Display {
    return this.display
  }

  public getDescription(): Display {
    return this.description
  }

  public static fromJson(json: ProfileEntryDetailsFieldData): ProfileEntryDetailsField {
    return new ProfileEntryDetailsField(
      Display.fromJson(json.display),
      Display.fromJson(json.description)
    )
  }
}
