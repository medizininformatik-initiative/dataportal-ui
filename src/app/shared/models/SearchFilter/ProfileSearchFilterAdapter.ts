import { CriteriaSearchFilterValue } from 'src/app/model/Search/Filter/CriteriaSearchFilterValue'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { SearchFilter, SearchFilterValues } from './InterfaceSearchFilter'

export class ProfileSearchFilterAdapter {
  public static convertToFilterValues(filter: CriteriaSearchFilterValue[]): SearchFilter {
    const searchFilterValues: SearchFilterValues[] = filter.map(
      (filterValue: CriteriaSearchFilterValue) => this.createSearchFilterValue(filterValue)
    )
    return {
      filterType: ElasticSearchFilterTypes.MODULE,
      selectedValues: [],
      data: searchFilterValues,
    }
  }

  private static createSearchFilterValue(
    filterValue: CriteriaSearchFilterValue
  ): SearchFilterValues {
    const label = filterValue.getlabel()
    const count = filterValue.getCount()
    const display = label

    return {
      count,
      label,
      display,
    }
  }
}
