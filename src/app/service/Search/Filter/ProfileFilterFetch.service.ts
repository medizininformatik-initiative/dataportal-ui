import { Injectable, inject } from '@angular/core'
import { ProfileSearchFilterProviderService } from './ProfileSearchFilterProvider.service'
import { ProfileSearchFilterService } from './ProfileSearchFilter.service'
import { SearchUrlBuilder } from '../UrlBuilder/SearchUrlBuilder'
import { DataSelectionPaths } from '../../Backend/Paths/DataSelectionPaths'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { ProfileSearchFilter } from 'src/app/model/Search/Filter/ProfileSearchFilter'

@Injectable({
  providedIn: 'root',
})
export class ProfileFilterFetchService {
  private profileSearchFilterService = inject(ProfileSearchFilterService)
  private profileSearchFilterProviderService = inject(ProfileSearchFilterProviderService)

  public fetchAndUpdateFilters(searchText: string, targetFilter: string): void {
    const url = this.buildUrl(searchText, targetFilter)
    this.profileSearchFilterService.fetchFilter(url).subscribe((fetchedFilters) => {
      this.mergeFiltersIntoProvider(fetchedFilters)
    })
  }

  private buildUrl(searchText: string, targetFilter?: string): string {
    const currentFilters = this.profileSearchFilterProviderService.getProfileSearchFiltersValue()
    const builder = new SearchUrlBuilder(DataSelectionPaths.PROFILE_SEARCH_FILTER).withSearchTerm(
      searchText
    )

    if (targetFilter) {
      builder.withTargetFilter(targetFilter)
    }

    const filtersToApply = targetFilter
      ? currentFilters.filter((f) => f.getName().toLowerCase() !== targetFilter.toLowerCase())
      : currentFilters

    filtersToApply
      .filter((f) => f.getSelectedValues().length > 0)
      .forEach((f) => {
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

  private mergeFiltersIntoProvider(fetchedFilters: ProfileSearchFilter[]): void {
    const currentFilters = this.profileSearchFilterProviderService.getProfileSearchFiltersValue()

    fetchedFilters.forEach((fetchedFilter) => {
      const existing = currentFilters.find((f) => f.getName() === fetchedFilter.getName())
      if (existing) {
        fetchedFilter.setSelectedValues(existing.getSelectedValues())
        existing.setSelectedValues(fetchedFilter.getSelectedValues())
        existing.setValues(fetchedFilter.getValues())
      }
    })

    this.profileSearchFilterProviderService.setProfileSearchFilters([...currentFilters])
  }
}
