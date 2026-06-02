import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter'
import { FilterProvider } from '../Search/Filter/SearchFilterProvider.service'
import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { SearchFilterService } from '../Search/Filter/SearchFilter.service'
import { SearchUrlBuilder } from '../Search/UrlBuilder/SearchUrlBuilder'
import { TerminologyPaths } from '../Backend/Paths/TerminologyPaths'

@Injectable({
  providedIn: 'root',
})
export class CriteriaSearchFilterResolverService {
  private searchFilterService = inject(SearchFilterService)
  private filterProvider = inject(FilterProvider)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Resolves the criteria search filters by fetching them from the backend.
   * @returns An observable containing an array of criteria search filters.
   */
  public resolve(): Observable<Array<CriteriaSearchFilter>> {
    const url = new SearchUrlBuilder(TerminologyPaths.SEARCH_FILTER_ENDPOINT).buildUrl()
    return this.searchFilterService.fetchFilters(url).pipe(
      map((filters) => {
        this.filterProvider.initializeFilterMap(filters)
        return filters
      })
    )
  }
}
