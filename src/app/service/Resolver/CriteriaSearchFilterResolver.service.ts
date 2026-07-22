import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter'
import { FilterProvider } from '../Search/Filter/SearchFilterProvider.service'
import { inject, Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'
import { CriteriaSearchFilterService } from '../Search/Filter/CriteriaSearchFilter.service'
import { SearchUrlBuilder } from '../Search/UrlBuilder/SearchUrlBuilder'
import { TerminologyPaths } from '../Backend/Paths/TerminologyPaths'

@Injectable({
  providedIn: 'root',
})
export class CriteriaSearchFilterResolverService {
  private searchFilterService = inject(CriteriaSearchFilterService)
  private filterProvider = inject(FilterProvider)

  constructor() {}

  /**
   * Resolves the criteria search filters by fetching them from the backend.
   * @returns An observable containing an array of criteria search filters.
   */
  public resolve(): Observable<Array<CriteriaSearchFilter>> {
    const url = new SearchUrlBuilder(TerminologyPaths.SEARCH_FILTER_ENDPOINT).buildUrl()
    return this.searchFilterService.fetchFilters(url).pipe(
      map((filters: CriteriaSearchFilter[]) => {
        this.filterProvider.initializeFilterMap(filters)
        return filters
      })
    )
  }
}
