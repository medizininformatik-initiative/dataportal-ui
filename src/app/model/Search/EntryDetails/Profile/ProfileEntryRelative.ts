import { ProfileRelativeData } from 'src/app/model/Interface/ListEntryDetailsData/ProfileRelativeData'
import { Display } from '../../../DataSelection/Profile/Display'
import { AbstractRelative } from '../AbstractRelative'

export class ProfileEntryRelative extends AbstractRelative {
  private readonly id: string
  private readonly hashedUrl: string

  constructor(id: string, display: Display, hashedUrl: string) {
    super(display)
    this.id = id
    this.hashedUrl = hashedUrl
  }

  public getId(): string {
    return this.id
  }

  public getHashedUrl(): string {
    return this.hashedUrl
  }

  public static fromJson(json: ProfileRelativeData): ProfileEntryRelative {
    return new ProfileEntryRelative(json.id, Display.fromJson(json.display), json.url)
  }
}
