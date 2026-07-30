import { AbstractDetails } from '../AbstractDetails'
import { Display } from '../../../DataSelection/Profile/Display'
import { ProfileEntryRelative } from './ProfileEntryRelative'

export class ProfileEntryDetails extends AbstractDetails<ProfileEntryRelative> {
  private readonly id: string
  private readonly url: string
  private readonly fields: Display[]

  constructor(
    id: string,
    display: Display,
    fields: Display[],
    parents: ProfileEntryRelative[] = [],
    children: ProfileEntryRelative[] = [],
    selectable: boolean,
    url: string
  ) {
    super(display, parents, children, selectable)
    this.id = id
    this.fields = fields
    this.url = url
  }

  public getId(): string {
    return this.id
  }

  public getFields(): Display[] {
    return this.fields
  }

  public getUrl(): string {
    return this.url
  }
}
