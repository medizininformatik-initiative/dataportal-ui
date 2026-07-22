import { ProfileSearchFilterValue } from './ProfileSearchFilterValue'

export abstract class AbstractSearchFilter<T extends ProfileSearchFilterValue> {
  protected name: string
  protected values: T[]
  protected selectedValues: string[]

  constructor(name: string, values: T[]) {
    this.name = name
    this.values = values
    this.selectedValues = []
  }

  public getName(): string {
    return this.name
  }

  public getValues(): T[] {
    return this.values
  }

  public getSelectedValues(): string[] {
    return this.selectedValues
  }

  public setSelectedValues(values: string[]): void {
    this.selectedValues = values
  }
}
