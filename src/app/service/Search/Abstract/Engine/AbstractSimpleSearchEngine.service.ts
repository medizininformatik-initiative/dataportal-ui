import { Observable } from 'rxjs'
import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { AbstractResultList } from 'src/app/model/Search/ResultList/AbstractResultList'
import { MappingStrategy } from '../../Interface/InterfaceMappingStrategy'
import { SearchEngine } from '../../SearchEngine'
import { AbstractSearchEngine } from './AbstractSearchEngine'

/**
 * @abstract
 * Abstract search engine for simple search operations without dataset filtering.
 * Extends AbstractSearchEngine to provide concrete search functionality for single-context
 * searches that don't require key-based filtering or multiple dataset support.
 *
 * @template C - Type extending AbstractListEntry representing individual search result entries
 * @template T - Type extending AbstractResultList representing the complete search result list
 */
export abstract class AbstractSimpleSearchEngine<C extends AbstractListEntry, T extends AbstractResultList<C>> extends AbstractSearchEngine<
  C,
  T
> {
  /**
   * Creates an instance of AbstractSimpleSearchEngine.
   *
   * @param {SearchEngine<C, T>} searchEngine - The underlying search engine service for processing search requests
   * @protected
   * @readonly
   */
  constructor(protected readonly searchEngine: SearchEngine<C, T>) {
    super(searchEngine)
  }

  /**
   * @abstract
   * @protected
   * Creates a search URL for simple search operations.
   *
   * @param {string} searchText - The text to search for
   * @param {number} page - The page number for pagination (0-based)
   * @returns {string} The constructed search URL as a string
   */
  protected abstract createUrl(searchText: string, page: number): string

  /**
   * @abstract
   * @protected
   * Provides the mapping strategy for transforming simple search results.
   * @see {MappingStrategy}
   * @returns {MappingStrategy<C, T>} An instance of MappingStrategy for simple search result mapping
   */
  protected abstract getMapping(): MappingStrategy<C, T>

  /**
   * Performs a simple search operation with pagination support.
   *
   * @param {string} searchTerm - The search term to query for
   * @param {number} page - The page number for pagination
   * @returns {Observable<T>} An Observable that emits the search results
   */
  public search(searchTerm: string, page: number): Observable<T> {
    const mapping = this.getMapping()
    const url = this.createUrl(searchTerm, page)
    return this.searchEngine.fetchAndMapSearchResults(url, mapping)
  }
}
