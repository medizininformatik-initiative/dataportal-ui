import { Display } from '../../DataSelection/Profile/Display'

export abstract class AbstractSearchFilterValue {
  protected count: number
  protected label?: string
  protected display?: Display | undefined
  constructor(count: number, label?: string, display?: Display) {
    this.count = count
    this.display = display
    this.label = label
  }

  public getLabel(): string | undefined {
    return this.label
  }

  public getCount(): number {
    return this.count
  }

  public getDisplay(): Display {
    return this.display
  }
}
