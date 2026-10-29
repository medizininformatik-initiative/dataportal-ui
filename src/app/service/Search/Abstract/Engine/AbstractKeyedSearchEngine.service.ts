import { Observable } from 'rxjs'
import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { AbstractResultList } from 'src/app/model/Search/ResultList/AbstractResultList'
import { MappingStrategy } from '../../Interface/InterfaceMappingStrategy'
import { SearchEngine } from '../../SearchEngine'
import { AbstractSearchEngine } from './AbstractSearchEngine'

/**
 * @abstract
 * Abstract search engine for keyed search operations with dataset filtering.
 * Extends AbstractSearchEngine to provide concrete search functionality for multi-context
 * searches that support key-based filtering and multiple dataset operations.
 *
 * @template C - Type extending AbstractListEntry representing individual search result entries
 * @template T - Type extending AbstractResultList representing the complete search result list
 */
export abstract class AbstractKeyedSearchEngineService<
  C extends AbstractListEntry,
  T extends AbstractResultList<C>
> extends AbstractSearchEngine<C, T> {
  /**
   * Creates an instance of AbstractKeyedSearchEngineService.
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
   * Creates a search URL for keyed search operations with dataset filtering.
   *
   * @param {string} searchText - The text to search for
   * @param {number} page - The page number for pagination (0-based)
   * @param {string[]} dataSetUrls - Array of dataset URLs to filter the search
   * @returns {string} The constructed search URL as a string
   */
  protected abstract createUrl(searchText: string, page: number, dataSetUrls: string[]): string

  /**
   * @abstract
   * @protected
   * @see {MappingStrategy}
   * Provides the mapping strategy for transforming keyed search results.
   *
   * @returns {MappingStrategy<C, T>} An instance of MappingStrategy for keyed search result mapping
   */
  protected abstract getMapping(): MappingStrategy<C, T>

  /**
   * Performs a keyed search operation with dataset filtering and pagination support.
   *
   * @param {string} searchTerm - The search term to query for
   * @param {number} page - The page number for pagination
   * @param {string[]} dataSetUrls - Array of dataset URLs to search within
   * @returns {Observable<T>} An Observable that emits the search results
   */
  public search(searchTerm: string, page: number, dataSetUrls: string[]): Observable<T> {
    const mapping = this.getMapping()
    const url = this.createUrl(searchTerm, page, dataSetUrls)
    return this.searchEngine.fetchAndMapSearchResults(url, mapping)
  }
}
