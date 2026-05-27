import { AbstractKeyedSearch } from '../../Abstract/AbstractKeyedSearch'
import { CodeableConceptResultList } from 'src/app/model/Search/ResultList/CodeableConcepttResultList'
import { CodeableConceptResultListEntry } from 'src/app/model/Search/ListEntries/CodeableConceptResultListEntry'
import { CodeableConceptSearchPaginationService } from './Pagination/CodeableConceptSearchPagination.service'
import { CodeableConceptSearchResultProviderService } from './Result/CodeableConceptSearchResultProvider.service'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'

/**
 * Service for performing codeable concept searches with value set filtering.
 * Extends AbstractKeyedSearch to provide specific functionality for searching
 * codeable concepts within specified value sets with pagination support.
 */
@Injectable({
  providedIn: 'root',
})
export class CodeableConceptSearchService extends AbstractKeyedSearch<
  CodeableConceptResultListEntry,
  CodeableConceptResultList
> {
  private paginationService = inject(CodeableConceptSearchPaginationService)

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
   * @param searchText - The text to search for within codeable concepts
   * @param valueSetUrls - Array of value set URLs to search within
   * @returns An Observable that emits the first page of codeable concept search results
   */
  public search(searchText: string, valueSetUrls: string[]): Observable<CodeableConceptResultList> {
    return this.paginationService.searchFirstPageOfCodeableConcept(searchText, valueSetUrls)
  }

  /**
   * Loads the next page of results for a previously executed codeable concept search.
   *
   * @param searchText - The original search text
   * @param valueSetUrls - Array of value set URLs used in the original search
   * @returns An Observable that emits the next page of codeable concept search results
   */
  public loadNextPage(
    searchText: string,
    valueSetUrls: string[]
  ): Observable<CodeableConceptResultList> {
    return this.paginationService.loadNextPageOfCodeableConceptResults(searchText, valueSetUrls)
  }

  /**
   * @protected
   * Sets the current search term for internal state management.
   * Currently a placeholder implementation - extend as needed for specific requirements.
   *
   * @param searchTerm - The search term to set
   */
  protected setSearchTerm(searchTerm: string): void {
    // Implement logic to set the search term if needed
  }
}
