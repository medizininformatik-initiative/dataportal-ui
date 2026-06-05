import { AbstractSimpleSearch } from '../../Abstract/AbstractSimpleSearch'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { CriteriaSearchPaginationService } from './Pagination/CriteriaSearchPagination.service'
import { CriteriaSearchResultProviderService } from './Result/CriteriaSearchResultProvider.service'
import { CriteriaSearchStateService } from '../../CriteriaSearchState.service'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CriteriaSearchService extends AbstractSimpleSearch<
  CriteriaListEntry,
  CriteriaResultList
> {
  private paginator = inject(CriteriaSearchPaginationService)
  private criteriaSearchStateService = inject(CriteriaSearchStateService)

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

  /**
   * @param {string} searchTerm
   * @returns {Observable<CriteriaResultList>}
   */
  public loadNextPage(searchTerm: string): Observable<CriteriaResultList> {
    this.setSearchTerm(searchTerm)
    return this.paginator.loadNextPage(searchTerm)
  }

  /**
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
