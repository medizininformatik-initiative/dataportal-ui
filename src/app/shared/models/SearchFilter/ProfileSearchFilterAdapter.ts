import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { ProfileSearchFilter } from 'src/app/model/Search/Filter/ProfileSearchFilter'
import { ProfileSearchFilterValue } from 'src/app/model/Search/Filter/ProfileSearchFilterValue'
import { SearchFilterData, SearchFilterValueData } from './SearchFilterData'

export class ProfileSearchFilterAdapter {
  public static convertToFilterValues(filters: ProfileSearchFilter[]): SearchFilterData[] {
    return filters.map((filter) => {
      const searchFilterValues: SearchFilterValueData[] = filter
        .getValues()
        .map((filterValue: ProfileSearchFilterValue) => this.createSearchFilterValue(filterValue))

      return {
        filterType: this.mapFilterType(filter.getName()),
        selectedValues: filter.getSelectedValues(),
        data: searchFilterValues,
      }
    })
  }

  private static createSearchFilterValue(
    filterValue: ProfileSearchFilterValue
  ): SearchFilterValueData {
    const count = filterValue.getCount()
    const display = filterValue.getDisplay()
    const label = filterValue.getLabel() ?? display?.getOriginal()

    return {
      count,
      label,
      display,
    }
  }

  private static mapFilterType(filterName: string): ElasticSearchFilterTypes {
    if (filterName === ElasticSearchFilterTypes.MODULE) {
      return ElasticSearchFilterTypes.MODULE
    }

    if (filterName === ElasticSearchFilterTypes.CATEGORY) {
      return ElasticSearchFilterTypes.CATEGORY
    }

    if (filterName === ElasticSearchFilterTypes.RESOURCE_TYPE) {
      return ElasticSearchFilterTypes.RESOURCE_TYPE
    }

    return ElasticSearchFilterTypes.MODULE
  }
}
