import { Display } from '../../DataSelection/Profile/Display'
import { ProfileEntryRelative } from './ProfileEntryRelative'

export class ProfileEntryDetails {
  private readonly id: string
  private readonly display: Display
  private fields: Display[]
  private readonly parents: ProfileEntryRelative[]
  private children: ProfileEntryRelative[]

  constructor(
    id: string,
    display: Display,
    fields: Display[],
    parents: ProfileEntryRelative[],
    children: ProfileEntryRelative[]
  ) {
    this.id = id
    this.display = display
    this.fields = fields
    this.parents = parents
    this.children = children
  }

  public getId(): string {
    return this.id
  }

  public getDisplay(): Display {
    return this.display
  }

  public getFields(): Display[] {
    return this.fields
  }
  public getParents(): ProfileEntryRelative[] {
    return this.parents
  }

  public getChildren(): ProfileEntryRelative[] {
    return this.children
  }
}
