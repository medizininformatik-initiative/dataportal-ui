import { AbstractSearchFilter } from './AbstractSearchFilter'
import { ProfileSearchFilterValue } from './ProfileSearchFilterValue'
import { SearchFilterData } from '../../Interface/Search/Filter/SearchFilterData'
import { SearchFilterValueData } from '../../Interface/Search/Filter/SearchFilterValueData'

export class ProfileSearchFilter extends AbstractSearchFilter<ProfileSearchFilterValue> {
  constructor(name: string, values: Array<ProfileSearchFilterValue>) {
    super(name, values)
  }

  public static fromJson(json: SearchFilterData): ProfileSearchFilter {
    return new ProfileSearchFilter(
      json.name,
      json.values.map((value: SearchFilterValueData) => ProfileSearchFilterValue.fromJson(value))
    )
  }
}
