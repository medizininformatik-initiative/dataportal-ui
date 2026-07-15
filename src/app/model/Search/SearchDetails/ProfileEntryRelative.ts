import { Display } from '../../DataSelection/Profile/Display'

export class ProfileEntryRelative {
  private readonly id: string
  private readonly display: Display
  private readonly hashedUrl: string

  constructor(id: string, display: Display, hashedUrl: string) {
    this.id = id
    this.display = display
    this.hashedUrl = hashedUrl
  }

  public getId(): string {
    return this.id
  }

  public getDisplay(): Display {
    return this.display
  }

  public getHashedUrl(): string {
    return this.hashedUrl
  }
}
