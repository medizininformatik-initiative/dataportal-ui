import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { AbstractSimpleSearch } from '../../Abstract/AbstractSimpleSearch'
import { CriteriaSearchStateService } from '../../CriteriaSearchState.service'
import { CriteriaSearchPaginationService } from './Pagination/CriteriaSearchPagination.service'
import { CriteriaSearchResultProviderService } from './Result/CriteriaSearchResultProvider.service'

@Injectable({
  providedIn: 'root',
})
export class CriteriaSearchService extends AbstractSimpleSearch<CriteriaListEntry, CriteriaResultList> {
  private readonly paginator = inject(CriteriaSearchPaginationService)
  private readonly criteriaSearchStateService = inject(CriteriaSearchStateService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    const resultProvider = inject(CriteriaSearchResultProviderService)

    super(resultProvider)
  }

  /**
   * Starts a new search with the given search term and sets the search term as active.
   * @param {string} searchTerm
   * @returns {Observable<CriteriaResultList>}
   */
  public search(searchTerm: string): Observable<CriteriaResultList> {
    this.setSearchTerm(searchTerm)
    return this.paginator.searchFirstPage(searchTerm)
  }

  public loadNextPage(searchTerm: string): Observable<CriteriaResultList> {
    this.setSearchTerm(searchTerm)
    return this.paginator.loadNextPage(searchTerm)
  }

  /**
   * Returns the search results.
   *
   * @returns {Observable<CriteriaResultList>
   */
  public getSearchResults(): Observable<CriteriaResultList> {
    return this.resultProviderService.getSearchResults()
  }

  protected setSearchTerm(searchTerm: string) {
    this.criteriaSearchStateService.setActiveSearchTerm(searchTerm)
  }

  public getActiveSearchTerm(): Observable<string> {
    return this.criteriaSearchStateService.getActiveSearchTerm()
  }
}
