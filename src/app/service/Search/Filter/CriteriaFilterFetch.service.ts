import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { FilterProvider } from './SearchFilterProvider.service'
import { Injectable, inject } from '@angular/core'
import { CriteriaSearchFilterService } from './CriteriaSearchFilter.service'
import { SearchUrlBuilder } from '../UrlBuilder/SearchUrlBuilder'
import { TerminologyPaths } from '../../Backend/Paths/TerminologyPaths'

@Injectable({
  providedIn: 'root',
})
export class CriteriaFilterFetchService {
  private searchFilterService = inject(CriteriaSearchFilterService)
  private filterProvider = inject(FilterProvider)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Builds a filter request URL from the current search context, fetches updated
   * filter options from the backend, and merges them into the filter provider
   * while preserving current selected values.
   *
   * When a targetFilter is provided, its selected values are excluded from the
   * URL parameters (consistent with the API contract: the target filter's own
   * current selection should not constrain the options returned for it).
   *
   * @param searchText The current search term.
   * @param targetFilter The filter type that is the target of the request.
   */
  public fetchAndUpdateFilters(searchText: string, targetFilter: string): void {
    const url = this.buildUrl(searchText, targetFilter?.toLocaleLowerCase())
    this.searchFilterService.fetchFilters(url).subscribe((fetchedFilters) => {
      this.mergeFiltersIntoProvider(fetchedFilters)
    })
  }

  private buildUrl(searchText: string, targetFilter?: string): string {
    const currentFilters = this.filterProvider.getCriteriaSearchFiltersValue()
    const builder = new SearchUrlBuilder(TerminologyPaths.SEARCH_FILTER_ENDPOINT).withSearchTerm(
      searchText
    )

    if (targetFilter) {
      builder.withTargetFilter(targetFilter)
    }

    const filtersToApply = targetFilter
      ? currentFilters.filter((f) => f.getName() !== targetFilter)
      : currentFilters

    filtersToApply
      .filter((f) => f.getSelectedValues().length > 0)
      .forEach((f) => {
        const values = f.getSelectedValues().join(', ')
        const name = f.getName()
        if (name === ElasticSearchFilterTypes.CONTEXT) {
          builder.withContext(values)
        } else if (name === ElasticSearchFilterTypes.KDS_MODULE) {
          builder.withKds(values)
        } else if (name === ElasticSearchFilterTypes.TERMINOLOGY) {
          builder.withTerminology(values)
        }
      })

    return builder.buildUrl()
  }

  /**
   * Update the existing filters with the values
   * @param fetchedFilters
   */
  private mergeFiltersIntoProvider(fetchedFilters: CriteriaSearchFilter[]): void {
    const currentFilters = this.filterProvider.getCriteriaSearchFiltersValue()
    fetchedFilters.forEach((fetchedFilter) => {
      const existing = currentFilters.find((f) => f.getName() === fetchedFilter.getName())
      if (existing) {
        existing.setValues(fetchedFilter.getValues())
      }
    })
    this.filterProvider.setCriteriaSearchFilters([...currentFilters])
  }
}
