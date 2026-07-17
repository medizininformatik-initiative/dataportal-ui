import { Display } from '../../../DataSelection/Profile/Display'
import { AbstractDetails } from '../AbstractDetails'
import { ProfileEntryRelative } from './ProfileEntryRelative'

export class ProfileEntryDetails extends AbstractDetails<ProfileEntryRelative> {
  private readonly id: string
  private readonly fields: Display[]

  constructor(
    id: string,
    display: Display,
    fields: Display[],
    parents: ProfileEntryRelative[] = [],
    children: ProfileEntryRelative[] = []
  ) {
    super(display, parents, children)
    this.id = id
    this.fields = fields
  }

  public getId(): string {
    return this.id
  }

  public getFields(): Display[] {
    return this.fields
  }
}
