import { AbstractKeyedSearchMediator } from '../../../Abstract/Mediator/AbstractKeyedSearchMediator'
import { CriteriaSetSearchEngineService } from '../Engine/CriteriaSetSearchEngine'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ReferenceCriteriaListEntry } from 'src/app/model/Search/ListEntries/ReferenceCriteriaListEntry'
import { ReferenceCriteriaResultList } from 'src/app/model/Search/ResultList/ReferenceCriteriaResultList'
import { CriteriaSetSearchResultProviderService } from '../Result/CriteriaSetSearchResultProvider.service '

/**
 * Mediator service for criteria set searches with support for multiple criteria set filters.
 * Handles the orchestration between search engine and result provider for criteria set-based searches.
 * Extends AbstractKeyedSearchMediator to support multiple concurrent searches
 * identified by criteria set URLs.
 */
@Injectable({
  providedIn: 'root',
})
export class CriteriaSetSearchMediatorService extends AbstractKeyedSearchMediator<
  ReferenceCriteriaListEntry,
  ReferenceCriteriaResultList
> {
  protected resultProvider: CriteriaSetSearchResultProviderService
  protected searchEngine: CriteriaSetSearchEngineService

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  /**
   * Creates an instance of CriteriaSetSearchMediatorService.
   *
   * @param resultProvider - The result provider for managing criteria set search results
   * @param searchEngine - The search engine for executing criteria set searches
   * @protected
   */
  constructor() {
    const resultProvider = inject(CriteriaSetSearchResultProviderService)
    const searchEngine = inject(CriteriaSetSearchEngineService)

    super(resultProvider, searchEngine)
    this.resultProvider = resultProvider
    this.searchEngine = searchEngine
  }

  /**
   * Performs a search for criteria sets and sets the results for the given criteria set URLs.
   *
   * @param searchText - The text to search for
   * @param criteriaSetUrls - Array of criteria set URLs to search within
   * @param page - The page number for pagination (defaults to 0)
   * @returns An Observable that emits the search results
   */
  public searchCriteriaSets(
    searchText: string,
    criteriaSetUrls: string[],
    page: number = 0
  ): Observable<ReferenceCriteriaResultList> {
    return this.searchAndSetProvider(searchText, page, criteriaSetUrls)
  }

  /**
   * Performs a search for criteria sets and appends results for pagination.
   *
   * @param searchText - The text to search for
   * @param criteriaSetUrls - Array of criteria set URLs to search within
   * @param page - The page number for pagination
   * @returns An Observable that emits the updated search results
   */
  public searchAndAppendCriteriaSets(
    searchText: string,
    criteriaSetUrls: string[],
    page: number
  ): Observable<ReferenceCriteriaResultList> {
    return this.searchAndUpdateProvider(searchText, page, criteriaSetUrls)
  }
}
