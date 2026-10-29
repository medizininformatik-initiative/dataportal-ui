import { Observable } from 'rxjs'
import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { AbstractResultList } from 'src/app/model/Search/ResultList/AbstractResultList'
import { AbstractSearch } from './AbstractSearch'
import { AbstractKeyedSearchResultProvider } from './Result/AbstractKeyedSearchResultProvider.service'

/**
 * @abstract
 * Abstract class for keyed search functionality where searches are associated with specific dataset URLs.
 * Extends AbstractSearch to provide key-based search operations that can filter results
 * by dataset URLs and manage multiple search contexts simultaneously.
 *
 * @template C - Type extending AbstractListEntry representing individual search result entries
 * @template T - Type extending AbstractResultList representing the complete search result list
 */
export abstract class AbstractKeyedSearch<C extends AbstractListEntry, T extends AbstractResultList<C>> extends AbstractSearch<C, T> {
  /**
   * Creates an instance of AbstractKeyedSearch.
   *
   * @param {AbstractKeyedSearchResultProvider<C, T>} resultProviderService - The keyed result provider service for managing search results by dataset URLs
   * @protected
   */
  constructor(protected resultProviderService: AbstractKeyedSearchResultProvider<C, T>) {
    super(resultProviderService)
  }

  /**
   * @abstract
   * Performs a search operation within the specified dataset URLs.
   *
   * @param {string} searchTerm - The term to search for
   * @param {string[]} dataSetUrls - Array of dataset URLs to search within
   * @returns {Observable<T>} An Observable that emits the search results
   */
  public abstract search(searchTerm: string, dataSetUrls: string[]): Observable<T>

  /**
   * @abstract
   * Loads the next page of search results for a previously executed keyed search.
   *
   * @param {string} searchTerm - The original search term
   * @param {string[]} dataSetUrls - Array of dataset URLs used in the search
   * @returns {Observable<T>} An Observable that emits the next page of search results
   */
  public abstract loadNextPage(searchTerm: string, dataSetUrls: string[]): Observable<T>

  /**
   * @abstract
   * @protected
   * Sets the current search term for internal state management.
   *
   * @param {string} searchTerm - The search term to set
   */
  protected abstract setSearchTerm(searchTerm: string): void

  /**
   * Retrieves the current search results for the specified dataset URLs.
   *
   * @param {string[]} dataSetUrls - Array of dataset URLs to retrieve results for
   * @returns {Observable<T>} An Observable that emits the search results for the specified datasets
   */
  public getSearchResults(dataSetUrls: string[]): Observable<T> {
    return this.resultProviderService.getSearchResults(dataSetUrls)
  }
}
