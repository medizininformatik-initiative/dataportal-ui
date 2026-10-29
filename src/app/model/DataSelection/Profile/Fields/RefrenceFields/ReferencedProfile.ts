import { ReferencedProfileData } from 'src/app/model/Interface/ReferencedProfileData'
import { Display } from '../../Display'

export class ReferencedProfile {
  private readonly url: string
  private readonly display: Display
  private readonly fields: Display

  constructor(url: string, display: Display, fields: Display) {
    this.url = url
    this.display = display
    this.fields = fields
  }
  public getUrl(): string {
    return this.url
  }

  public getDisplay(): Display {
    return this.display
  }

  public getFields(): Display {
    return this.fields
  }

  public static fromJson(data: ReferencedProfileData): ReferencedProfile {
    return new ReferencedProfile(data.url, Display.fromJson(data.display), Display.fromJson(data.fields))
  }
}
