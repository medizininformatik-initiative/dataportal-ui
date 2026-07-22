import { AbstractSearchFilterValue } from './AbstractSearchFilterValue'
import { SearchFilterValueData } from '../../Interface/Search/Filter/SearchFilterValueData'

export class CriteriaSearchFilterValue extends AbstractSearchFilterValue {
  constructor(count: number, label: string) {
    super(count, label)
  }

  public static fromJson(json: SearchFilterValueData): CriteriaSearchFilterValue {
    return new CriteriaSearchFilterValue(json.count, json.label)
  }
}
