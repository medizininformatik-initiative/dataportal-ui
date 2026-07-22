import { filter } from 'lodash'
import { CriteriaSearchFilterValue } from './CriteriaSearchFilterValue'

export class ProfileSearchFilter {
  private readonly name: string
  private readonly values: CriteriaSearchFilterValue[]

  constructor(name: string, values: CriteriaSearchFilterValue[]) {
    this.name = name
    this.values = values
  }

  public getName(): string {
    return this.name
  }

  public getValues(): CriteriaSearchFilterValue[] {
    return this.values
  }

  public static fromJson(json: any): ProfileSearchFilter {
    return new ProfileSearchFilter(
      json.name,
      json.values.map((value) => new CriteriaSearchFilterValue(value.count, value.label))
    )
  }
}
