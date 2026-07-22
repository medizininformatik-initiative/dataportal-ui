import { SearchFilterValueData } from '../../Interface/Search/Filter/SearchFilterValueData'
import { AbstractSearchFilterValue } from './AbstractSearchFilterValue'

export class ProfileSearchFilterValue extends AbstractSearchFilterValue {
  constructor(count: number, label: string) {
    super(count, label)
  }

  public static fromJson(json: SearchFilterValueData): ProfileSearchFilterValue {
    return new ProfileSearchFilterValue(json.count, json.label)
  }
}
