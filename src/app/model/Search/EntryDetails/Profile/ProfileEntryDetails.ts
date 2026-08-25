import { AbstractDetails } from '../AbstractDetails'
import { Display } from '../../../DataSelection/Profile/Display'
import { ProfileEntryRelative } from './ProfileEntryRelative'
import { ProfileEntryDetailsData } from 'src/app/model/Interface/ListEntryDetailsData/ProfileEntryDetailsData'
import { ProfileEntryDetailsField } from './ProfileEntryDetailsField'

export class ProfileEntryDetails extends AbstractDetails<ProfileEntryRelative> {
  private readonly id: string
  private readonly description: Display
  private readonly url: string
  private readonly fields: ProfileEntryDetailsField[]

  constructor(
    id: string,
    display: Display,
    description: Display,
    fields: ProfileEntryDetailsField[],
    parents: ProfileEntryRelative[] = [],
    children: ProfileEntryRelative[] = [],
    selectable: boolean,
    url: string
  ) {
    super(display, parents, children, selectable)
    this.id = id
    this.description = description
    this.fields = fields
    this.url = url
  }

  public getId(): string {
    return this.id
  }

  public getFields(): ProfileEntryDetailsField[] {
    return this.fields
  }

  public getUrl(): string {
    return this.url
  }

  public getDescription(): Display {
    return this.description
  }

  /**
   * @param {ProfileEntryDetailsData} json
   * @returns {ProfileEntryDetails}
   */
  public static fromJson(json: ProfileEntryDetailsData): ProfileEntryDetails {
    return new ProfileEntryDetails(
      json.id,
      Display.fromJson(json.display),
      Display.fromJson(json.description),
      json.fields.map((field) => ProfileEntryDetailsField.fromJson(field)),
      json.parents.map((parent) => ProfileEntryRelative.fromJson(parent)),
      json.children.map((child) => ProfileEntryRelative.fromJson(child)),
      json.selectable,
      json.url
    )
  }
}
