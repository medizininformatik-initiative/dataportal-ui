import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { AbstractResultList } from 'src/app/model/Search/ResultList/AbstractResultList'

/**
 * @abstract
 * Abstract base class defining the interface for all search result providers.
 * Serves as the foundational contract that all result providers must implement,
 * handling storage, retrieval, and management of search results.
 *
 * @template C - Type extending AbstractListEntry representing individual search result entries
 * @template T - Type extending AbstractResultList representing the complete search result list
 */
@Injectable({
  providedIn: 'root',
})
export abstract class AbstractSearchResultProviderService<C extends AbstractListEntry, T extends AbstractResultList<C>> {
  /**
   * Creates an instance of AbstractSearchResultProviderService.
   */
  constructor() {}

  /**
   * @abstract
   * Sets search results in the provider's storage.
   * Implementation varies based on storage strategy (simple vs keyed).
   *
   * @param {any[]} args - Variable arguments depending on the implementation strategy
   */
  public abstract setSearchResults(...args: any[]): void

  /**
   * @abstract
   * Updates existing search results by appending new results.
   * Used for pagination and incremental result loading.
   * Implementation varies based on storage strategy (simple vs keyed).
   *
   * @param {any[]} args - Variable arguments depending on the implementation strategy
   */
  public abstract updateSearchResults(...args: any[]): void

  /**
   * @abstract
   * Retrieves search results as an observable stream.
   * Implementation varies based on storage strategy (simple vs keyed).
   *
   * @param {any[]} args - Variable arguments depending on the implementation strategy
   * @returns {Observable<T | null>} An Observable that emits the search results or null if no results
   */
  public abstract getSearchResults(...args: any[]): Observable<T | null>

  /**
   * @abstract
   * Clears search results from the provider's storage.
   * Implementation varies based on storage strategy (simple vs keyed).
   *
   * @param {any[]} args - Variable arguments depending on the implementation strategy
   */
  public abstract clearResults(...args: any[]): void
}
