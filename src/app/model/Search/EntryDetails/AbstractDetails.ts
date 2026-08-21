import { AbstractRelative } from './AbstractRelative'
import { Display } from '../../DataSelection/Profile/Display'

export abstract class AbstractDetails<T extends AbstractRelative> {
  private readonly display: Display
  private readonly parents: T[]
  private readonly children: T[]
  private readonly selectable: boolean

  constructor(display: Display, parents: T[] = [], children: T[] = [], selectable: boolean) {
    this.display = display
    this.parents = parents
    this.children = children
    this.selectable = selectable
  }

  public getDisplay(): Display {
    return this.display
  }

  public getParents(): T[] {
    return this.parents
  }

  public getChildren(): T[] {
    return this.children
  }

  public getSelectable(): boolean {
    return this.selectable
  }
}
