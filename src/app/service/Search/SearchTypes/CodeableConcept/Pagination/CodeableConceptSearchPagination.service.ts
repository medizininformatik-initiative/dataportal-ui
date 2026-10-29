import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { CodeableConceptResultListEntry } from 'src/app/model/Search/ListEntries/CodeableConceptResultListEntry'
import { CodeableConceptResultList } from 'src/app/model/Search/ResultList/CodeableConcepttResultList'
import { KeyedSearchPagination } from '../../../Abstract/Pagination/AbstractKeyedSearchPagination'
import { CodeableConceptSearchMediatorService } from '../Mediator/CodeableConceptSearchMediator.service'

/**
 * Pagination service for CodeableConcept searches with support for multiple concept filters.
 * Handles pagination state management for keyed search results (concept filter IDs).
 *
 * This service extends KeyedSearchPagination to support multiple concurrent paginations
 * for different concept filters.
 */
@Injectable({
  providedIn: 'root',
})
export class CodeableConceptSearchPaginationService extends KeyedSearchPagination<
  CodeableConceptResultListEntry,
  CodeableConceptResultList
> {
  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    const mediatorService = inject(CodeableConceptSearchMediatorService)

    super(mediatorService)
  }

  /**
   * Loads the next page of CodeableConcept results.
   * @param {string} searchTerm The search term to use for filtering results.
   * @param {string[]} dataSetUrl Array of data set URLs to search within.
   * @returns {Observable<CodeableConceptResultList>} Observable containing the next page of search results.
   */
  public loadNextPageOfCodeableConceptResults(searchTerm: string, dataSetUrl: string[]): Observable<CodeableConceptResultList> {
    return this.loadNextPage(searchTerm, dataSetUrl)
  }

  /**
   * This method is used to initiate a search for CodeableConcepts with a specific search term and data set URLs.
   * It returns an Observable that emits the search results for the first page.
   * @param {string} searchTerm
   * @param {string[]} dataSetUrl
   * @returns {Observable<CodeableConceptResultList>} Observable containing the search results for the first page of CodeableConcepts.
   */
  public searchFirstPageOfCodeableConcept(searchTerm: string, dataSetUrl: string[]): Observable<CodeableConceptResultList> {
    return this.searchFirstPage(searchTerm, dataSetUrl)
  }

  /**
   * Loads the next page of results for a specific concept filter.
   * @param searchText The search text to use for filtering results.
   * @param valueSetUrls Array of value set URLs to filter results.
   * @returns Observable containing the next page of search results.
   * @param {string[]} dataSetUrl
   */
  public resetPaginationForConceptFilter(dataSetUrl: string[]): void {
    this.resetPaginationForKey(dataSetUrl)
  }
}
