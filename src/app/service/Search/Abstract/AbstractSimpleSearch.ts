import { Observable } from 'rxjs'
import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { AbstractResultList } from 'src/app/model/Search/ResultList/AbstractResultList'
import { AbstractSearch } from './AbstractSearch'
import { AbstractSimpleSearchResultProvider } from './Result/AbstractSimpleSearchResultProvider.service'

/**
 * @abstract
 * Abstract class for simple search functionality without dataset filtering.
 * Extends AbstractSearch to provide straightforward search operations that operate
 * on a single search context without key-based filtering or multiple dataset support.
 *
 * @template C - Type extending AbstractListEntry representing individual search result entries
 * @template T - Type extending AbstractResultList representing the complete search result list
 */
export abstract class AbstractSimpleSearch<C extends AbstractListEntry, T extends AbstractResultList<C>> extends AbstractSearch<C, T> {
  /**
   * Creates an instance of AbstractSimpleSearch.
   *
   * @param {AbstractSimpleSearchResultProvider<C, T>} resultProviderService - The simple result provider service for managing search results
   * @protected
   */
  constructor(protected resultProviderService: AbstractSimpleSearchResultProvider<C, T>) {
    super(resultProviderService)
  }

  /**
   * @abstract
   * Performs a simple search operation with the given search term.
   *
   * @param {string} searchTerm - The term to search for
   * @returns {Observable<T>} An Observable that emits the search results
   */
  public abstract search(searchTerm: string): Observable<T>

  /**
   * @abstract
   * Loads the next page of results for a previously executed simple search.
   *
   * @param {string} searchTerm - The original search term
   * @returns {Observable<T>} An Observable that emits the next page of search results
   */
  public abstract loadNextPage(searchTerm: string): Observable<T>

  /**
   * Retrieves the current search results without performing a new search.
   *
   * @returns {Observable<T>} An Observable that emits the current search results
   */
  public getSearchResults(): Observable<T> {
    return this.resultProviderService.getSearchResults()
  }

  /**
   * @abstract
   * @protected
   * Sets the current search term for internal state management.
   *
   * @param {string} searchTerm - The search term to set
   */
  protected abstract setSearchTerm(searchTerm: string): void
}
