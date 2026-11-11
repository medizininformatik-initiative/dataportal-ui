import { AbstractKeyedSearchEngineService } from '../Engine/AbstractKeyedSearchEngine.service'
import { AbstractKeyedSearchResultProvider } from '../Result/AbstractKeyedSearchResultProvider.service'
import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { AbstractResultList } from 'src/app/model/Search/ResultList/AbstractResultList'
import { AbstractSearchMediatorService } from './AbstractSearchMediator'
import { Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'

/**
 * @abstract
 * Abstract mediator implementation for keyed search operations with datasets.
 *
 * @template C - Type extending AbstractListEntry representing individual search result entries
 * @template T - Type extending AbstractResultList representing the complete search result list
 */
@Injectable({
  providedIn: 'root',
})
export abstract class AbstractKeyedSearchMediator<
  C extends AbstractListEntry,
  T extends AbstractResultList<C>
> extends AbstractSearchMediatorService<C, T> {
  /**
   * Creates an instance of AbstractKeyedSearchMediator.
   *
   * @param resultProvider - The keyed result provider for managing search results by dataset URLs
   * @param searchEngine - The keyed search engine for executing dataset-filtered searches
   * @protected
   */
  constructor(
    protected resultProvider: AbstractKeyedSearchResultProvider<C, T>,
    protected searchEngine: AbstractKeyedSearchEngineService<C, T>
  ) {
    super(resultProvider, searchEngine)
  }

  /**
   * Performs a keyed search operation and sets the results for the specified dataset URLs.
   *
   * @param searchText - The text to search for
   * @param page - The page number for pagination (defaults to 0)
   * @param dataSetUrl - Array of dataset URLs that serve as keys for result storage
   * @returns An Observable that emits the search results
   * @throws Error when dataSetUrl array is empty
   */
  public searchAndSetProvider(
    searchText: string,
    page: number = 0,
    dataSetUrl: string[]
  ): Observable<T> {
    if (dataSetUrl.length === 0) {
      throw new Error('KeyedSearchMediatorService requires a key parameter for search operations')
    }
    return this.searchEngine
      .search(searchText, page, dataSetUrl)
      .pipe(tap((result) => this.resultProvider.setSearchResults(dataSetUrl, result)))
  }

  /**
   * Performs a keyed search operation and updates existing results for the specified dataset URLs.
   * Used for pagination scenarios where new results need to be appended to existing data.
   *
   * @param searchText - The text to search for
   * @param page - The page number for pagination
   * @param dataSetUrl - Array of dataset URLs that serve as keys for result updates
   * @returns An Observable that emits the updated search results
   * @throws Error when dataSetUrl array is empty
   */
  public searchAndUpdateProvider(
    searchText: string,
    page: number,
    dataSetUrl: string[]
  ): Observable<T> {
    if (dataSetUrl.length === 0) {
      throw new Error('KeyedSearchMediatorService requires a key parameter for update operations')
    }
    return this.searchEngine
      .search(searchText, page, dataSetUrl)
      .pipe(tap((result) => this.resultProvider.updateSearchResults(dataSetUrl, result)))
  }
}
