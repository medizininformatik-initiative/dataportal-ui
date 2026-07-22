export abstract class AbstractSearchFilterValue {
  protected count: number
  protected label: string

  constructor(count: number, label: string) {
    this.count = count
    this.label = label
  }

  public getLabel(): string {
    return this.label
  }

  public getCount(): number {
    return this.count
  }
}
