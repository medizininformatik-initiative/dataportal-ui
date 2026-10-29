import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ReferenceCriteriaListEntry } from 'src/app/model/Search/ListEntries/ReferenceCriteriaListEntry'
import { ReferenceCriteriaResultList } from 'src/app/model/Search/ResultList/ReferenceCriteriaResultList'
import { KeyedSearchPagination } from '../../../Abstract/Pagination/AbstractKeyedSearchPagination'
import { CriteriaSetSearchMediatorService } from '../Mediator/CriteriaSetSearchMediator.service'

/**
 * Pagination service for criteria set searches with support for multiple criteria set filters.
 * Handles pagination state management for keyed search results (criteria set URLs).
 * Extends KeyedSearchPagination to support multiple concurrent paginations
 * for different criteria sets.
 */
@Injectable({
  providedIn: 'root',
})
export class CriteriaSetSearchPaginationService extends KeyedSearchPagination<ReferenceCriteriaListEntry, ReferenceCriteriaResultList> {
  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  /**
   * Creates an instance of CriteriaSetSearchPaginationService.
   *
   * @param mediatorService - The mediator service for coordinating criteria set searches
   */
  constructor() {
    const mediatorService = inject(CriteriaSetSearchMediatorService)

    super(mediatorService)
  }

  /**
   * Loads the next page of criteria set results for the specified criteria set URLs.
   *
   * @param {string} searchTerm - The search term to use for filtering results
   * @param {string[]} criteriaSetUrls - Array of criteria set URLs to search within
   * @returns {Observable<ReferenceCriteriaResultList>} An Observable that emits the next page of criteria set search results
   */
  public loadNextPageOfCriteriaSetResults(searchTerm: string, criteriaSetUrls: string[]): Observable<ReferenceCriteriaResultList> {
    return this.loadNextPage(searchTerm, criteriaSetUrls)
  }

  /**
   * Searches for the first page of criteria set results within the specified criteria sets.
   *
   * @param {string} searchTerm - The search term to use for filtering results
   * @param {string[]} criteriaSetUrls - Array of criteria set URLs to search within
   * @returns {Observable<ReferenceCriteriaResultList>} An Observable that emits the first page of criteria set search results
   */
  public searchFirstPageOfCriteriaSet(searchTerm: string, criteriaSetUrls: string[]): Observable<ReferenceCriteriaResultList> {
    return this.searchFirstPage(searchTerm, criteriaSetUrls)
  }
}
