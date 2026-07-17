import { Display } from '../../DataSelection/Profile/Display'

export abstract class AbstractRelative {
  private display: Display

  constructor(display: Display) {
    this.display = display
  }

  public getDisplay(): Display {
    return this.display
  }

  public setDisplay(display: Display): void {
    this.display = display
  }
}
