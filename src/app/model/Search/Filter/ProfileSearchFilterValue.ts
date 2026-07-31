import { Display } from '../../DataSelection/Profile/Display'
import { SearchFilterValueData } from '../../Interface/Search/Filter/SearchFilterValueData'
import { AbstractSearchFilterValue } from './AbstractSearchFilterValue'

export class ProfileSearchFilterValue extends AbstractSearchFilterValue {
  constructor(count: number, label?: string, display?: Display) {
    super(count, label, display)
  }

  public static fromJson(json: SearchFilterValueData): ProfileSearchFilterValue {
    const label = json.label
    const display = json.display ? Display.fromJson(json.display) : undefined

    return new ProfileSearchFilterValue(json.count, label, display)
  }
}
