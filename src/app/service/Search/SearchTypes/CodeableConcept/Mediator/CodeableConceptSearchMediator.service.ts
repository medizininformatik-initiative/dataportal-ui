import { AbstractKeyedSearchMediator } from '../../../Abstract/Mediator/AbstractKeyedSearchMediator'
import { CodeableConceptResultList } from 'src/app/model/Search/ResultList/CodeableConcepttResultList'
import { CodeableConceptResultListEntry } from 'src/app/model/Search/ListEntries/CodeableConceptResultListEntry'
import { CodeableConceptSearchEngineService } from '../Engine/CodeableConceptSearchEngine.service'
import { CodeableConceptSearchResultProviderService } from '../Result/CodeableConceptSearchResultProvider.service'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'

/**
 * Mediator service for CodeableConcept searches with support for multiple concept filters.
 * Handles the orchestration between search engine and result provider for concept-based searches.
 *
 * This mediator extends KeyedSearchMediatorService to support multiple concurrent searches
 * identified by concept filter IDs.
 */
@Injectable({
  providedIn: 'root',
})
export class CodeableConceptSearchMediatorService extends AbstractKeyedSearchMediator<
  CodeableConceptResultListEntry,
  CodeableConceptResultList
> {
  protected resultProvider: CodeableConceptSearchResultProviderService
  protected searchEngine: CodeableConceptSearchEngineService

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    const resultProvider = inject(CodeableConceptSearchResultProviderService)
    const searchEngine = inject(CodeableConceptSearchEngineService)

    super(resultProvider, searchEngine)
    this.resultProvider = resultProvider
    this.searchEngine = searchEngine
  }

  /**
   * Performs a search for codeable concepts and sets the results for the given concept filter.
   *
   * @param searchText The text to search for
   * @param valueSetUrls Array of value set URLs to search within
   * @param page The page number for pagination (default: 0)
   * @returns Observable containing the search results
   */
  public searchCodeableConcepts(
    searchText: string,
    valueSetUrls: string[],
    page: number = 0
  ): Observable<CodeableConceptResultList> {
    return this.searchAndSetProvider(searchText, page, valueSetUrls)
  }

  /**
   * Performs a search for codeable concepts and appends results for pagination.
   *
   * @param searchText The text to search for
   * @param valueSetUrls Array of value set URLs to search within
   * @param page The page number for pagination
   * @returns Observable containing the search results
   */
  public searchAndUpdateCodeableConceptResults(
    searchText: string,
    valueSetUrls: string[],
    page: number
  ): Observable<CodeableConceptResultList> {
    return this.searchAndUpdateProvider(searchText, page, valueSetUrls)
  }
}
