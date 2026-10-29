import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { CodeableConceptResultListEntry } from 'src/app/model/Search/ListEntries/CodeableConceptResultListEntry'
import { CodeableConceptResultList } from 'src/app/model/Search/ResultList/CodeableConcepttResultList'
import { AbstractKeyedSearch } from '../../Abstract/AbstractKeyedSearch'
import { CodeableConceptSearchPaginationService } from './Pagination/CodeableConceptSearchPagination.service'
import { CodeableConceptSearchResultProviderService } from './Result/CodeableConceptSearchResultProvider.service'

/**
 * Service for performing codeable concept searches with value set filtering.
 * Extends AbstractKeyedSearch to provide specific functionality for searching
 * codeable concepts within specified value sets with pagination support.
 */
@Injectable({
  providedIn: 'root',
})
export class CodeableConceptSearchService extends AbstractKeyedSearch<CodeableConceptResultListEntry, CodeableConceptResultList> {
  private readonly paginationService = inject(CodeableConceptSearchPaginationService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  /**
   * Creates an instance of CodeableConceptSearchService.
   *
   * @param resultProvider - The result provider for managing codeable concept search results
   * @param paginationService - The pagination service for handling paginated searches
   */
  constructor() {
    const resultProvider = inject(CodeableConceptSearchResultProviderService)

    super(resultProvider)
  }

  /**
   * Performs a new codeable concept search within the specified value sets.
   *
   * @param {string} searchText - The text to search for within codeable concepts
   * @param {string[]} valueSetUrls - Array of value set URLs to search within
   * @returns {Observable<CodeableConceptResultList>} An Observable that emits the first page of codeable concept search results
   */
  public search(searchText: string, valueSetUrls: string[]): Observable<CodeableConceptResultList> {
    return this.paginationService.searchFirstPageOfCodeableConcept(searchText, valueSetUrls)
  }

  /**
   * Loads the next page of results for a previously executed codeable concept search.
   *
   * @param {string} searchText - The original search text
   * @param {string[]} valueSetUrls - Array of value set URLs used in the original search
   * @returns {Observable<CodeableConceptResultList>} An Observable that emits the next page of codeable concept search results
   */
  public loadNextPage(searchText: string, valueSetUrls: string[]): Observable<CodeableConceptResultList> {
    return this.paginationService.loadNextPageOfCodeableConceptResults(searchText, valueSetUrls)
  }

  /**
   * Sets the search term.
   * @protected
   * Sets the current search term for internal state management.
   * Currently a placeholder implementation - extend as needed for specific requirements.
   *
   * @param {string} searchTerm - The search term to set
   */
  protected setSearchTerm(searchTerm: string): void {
    // Implement logic to set the search term if needed
  }
}
