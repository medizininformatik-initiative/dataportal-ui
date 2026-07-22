import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { ProfileSearchFilterValue } from 'src/app/model/Search/Filter/ProfileSearchFilterValue'
import { SearchFilterData, SearchFilterValueData } from './SearchFilterData'

export class ProfileSearchFilterAdapter {
  public static convertToFilterValues(filter: ProfileSearchFilterValue[]): SearchFilterData {
    const searchFilterValues: SearchFilterValueData[] = filter.map(
      (filterValue: ProfileSearchFilterValue) => this.createSearchFilterValue(filterValue)
    )
    return {
      filterType: ElasticSearchFilterTypes.MODULE,
      selectedValues: [],
      data: searchFilterValues,
    }
  }

  private static createSearchFilterValue(
    filterValue: ProfileSearchFilterValue
  ): SearchFilterValueData {
    const label = filterValue.getLabel()
    const count = filterValue.getCount()
    const display = label

    return {
      count,
      label,
      display,
    }
  }
}
