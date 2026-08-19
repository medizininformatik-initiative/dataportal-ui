import { AbstractListEntry } from './AbstractListEntry'
import { Availability } from '../../Availability/Availability'
import { AvailabilityStatusType } from '../../Availability/AvailabilityStatusType'
import { Display } from '../../DataSelection/Profile/Display'
import { ProfileListEntryData } from '../../Interface/Search/ProfileListEntryData'

export class ProfileListEntry extends AbstractListEntry {
  private readonly display: Display
  private readonly availability: number
  private readonly module: Display
  private readonly selectable: boolean
  private readonly url: string
  private readonly resourceType: Display
  constructor(
    id: string,
    display: Display,
    availability: number,
    module: Display,
    resourceType: Display,
    selectable: boolean,
    url: string
  ) {
    super(id)
    this.display = display
    this.availability = availability
    this.module = module
    this.resourceType = resourceType
    this.selectable = selectable
    this.url = url
  }

  public getDisplay(): Display {
    return this.display
  }

  public getAvailability(): number {
    return this.availability
  }

  public getModule(): Display {
    return this.module
  }

  public getRessourceType(): Display {
    return this.resourceType
  }

  public getSelectable(): boolean {
    return this.selectable
  }

  public getAvailabilityStatus(): AvailabilityStatusType {
    return new Availability(this.availability).getStatus()
  }

  public getUrl(): string {
    return this.url
  }

  public static fromJson(json: ProfileListEntryData): ProfileListEntry {
    return new ProfileListEntry(
      json.id,
      Display.fromJson(json.display),
      json.availability,
      Display.fromJson(json.module.display),
      Display.fromJson(json.resourceType.display),
      json.selectable,
      json.url
    )
  }
}
