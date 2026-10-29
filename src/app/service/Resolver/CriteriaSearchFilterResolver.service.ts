import { inject, Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'
import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter'
import { TerminologyPaths } from '../Backend/Paths/TerminologyPaths'
import { CriteriaSearchFilterService } from '../Search/Filter/CriteriaSearchFilter.service'
import { FilterProvider } from '../Search/Filter/SearchFilterProvider.service'
import { SearchUrlBuilder } from '../Search/UrlBuilder/SearchUrlBuilder'

@Injectable({
  providedIn: 'root',
})
export class CriteriaSearchFilterResolverService {
  private readonly searchFilterService = inject(CriteriaSearchFilterService)
  private readonly filterProvider = inject(FilterProvider)

  constructor() {}

  /**
   * Resolves the criteria search filters by fetching them from the backend.
   * @returns {Observable<Array<CriteriaSearchFilter>>} An observable containing an array of criteria search filters.
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
