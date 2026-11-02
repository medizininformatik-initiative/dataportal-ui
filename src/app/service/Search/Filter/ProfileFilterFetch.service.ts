import { Injectable, inject } from '@angular/core'
import { ProfileSearchFilter } from 'src/app/model/Search/Filter/ProfileSearchFilter'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { DataSelectionPaths } from '../../Backend/Paths/DataSelectionPaths'
import { SearchUrlBuilder } from '../UrlBuilder/SearchUrlBuilder'
import { ProfileSearchFilterService } from './ProfileSearchFilter.service'
import { ProfileSearchFilterProviderService } from './ProfileSearchFilterProvider.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileFilterFetchService {
  private readonly profileSearchFilterService = inject(ProfileSearchFilterService)
  private readonly profileSearchFilterProviderService = inject(ProfileSearchFilterProviderService)

  /**
   * Fetches the filters for the search text and merges them into the provider.
   * @param {string} searchText
   * @param {string} targetFilter
   */
  public fetchAndUpdateFilters(searchText: string, targetFilter: string): void {
    const url = this.buildUrl(searchText, targetFilter)
    this.profileSearchFilterService.fetchFilter(url).subscribe((fetchedFilters: ProfileSearchFilter[]) => {
      this.mergeFiltersIntoProvider(fetchedFilters)
    })
  }

  /**
   * Builds the filter url from the search text and the current filters.
   * @param {string} searchText
   * @param {string} targetFilter
   * @returns {string}
   */
  private buildUrl(searchText: string, targetFilter?: string): string {
    const currentFilters = this.profileSearchFilterProviderService.getProfileSearchFiltersValue()
    const builder = new SearchUrlBuilder(DataSelectionPaths.PROFILE_SEARCH_FILTER).withSearchTerm(searchText)

    if (targetFilter) {
      builder.withTargetFilter(targetFilter)
    }

    const filtersToApply = targetFilter
      ? currentFilters.filter((f: ProfileSearchFilter) => f.getName().toLowerCase() !== targetFilter.toLowerCase())
      : currentFilters

    filtersToApply
      .filter((f: ProfileSearchFilter) => f.getSelectedValues().length > 0)
      .forEach((f: ProfileSearchFilter) => {
        const values = f.getSelectedValues().join(',')
        const name = f.getName()

        if (name === ElasticSearchFilterTypes.MODULE) {
          builder.withModule(values)
        } else if (name === ElasticSearchFilterTypes.CATEGORY) {
          builder.withCategory(values)
        } else if (name === ElasticSearchFilterTypes.RESOURCE_TYPE) {
          builder.withResourceType(values)
        }
      })

    return builder.buildUrl()
  }

  /**
   * Updates the provider with the fetched filters and keeps the selected values.
   * @param {ProfileSearchFilter[]} fetchedFilters
   */
  private mergeFiltersIntoProvider(fetchedFilters: ProfileSearchFilter[]): void {
    const currentFilters = this.profileSearchFilterProviderService.getProfileSearchFiltersValue()

    fetchedFilters.forEach((fetchedFilter: ProfileSearchFilter) => {
      const existing = currentFilters.find((f: ProfileSearchFilter) => f.getName() === fetchedFilter.getName())
      if (existing) {
        fetchedFilter.setSelectedValues(existing.getSelectedValues())
        existing.setSelectedValues(fetchedFilter.getSelectedValues())
        existing.setValues(fetchedFilter.getValues())
      }
    })

    this.profileSearchFilterProviderService.setProfileSearchFilters([...currentFilters])
  }
}
