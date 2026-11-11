import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { AbstractResultList } from 'src/app/model/Search/ResultList/AbstractResultList'
import { AbstractSearchMediatorService } from './AbstractSearchMediator'
import { AbstractSimpleSearchEngine } from '../Engine/AbstractSimpleSearchEngine.service'
import { AbstractSimpleSearchResultProvider } from '../Result/AbstractSimpleSearchResultProvider.service'
import { Observable, tap } from 'rxjs'

/**
 * @abstract
 * Abstract mediator implementation for simple search operations without dataset.
 * @template C - Type extending AbstractListEntry representing individual search result entries
 * @template T - Type extending AbstractResultList representing the complete search result list
 */
export abstract class AbstractSimpleSearchMediator<
  C extends AbstractListEntry,
  T extends AbstractResultList<C>
> extends AbstractSearchMediatorService<C, T> {
  /**
   * The simple result provider for managing single result set storage.
   * @protected
   */
  protected resultProvider: AbstractSimpleSearchResultProvider<C, T>

  /**
   * The simple search engine for executing search operations.
   * @protected
   */
  protected searchEngine: AbstractSimpleSearchEngine<C, T>

  /**
   * Creates an instance of AbstractSimpleSearchMediator.
   *
   * @param resultProvider - The simple result provider for managing search results
   * @param searchEngine - The simple search engine for executing search operations
   */
  constructor(
    resultProvider: AbstractSimpleSearchResultProvider<C, T>,
    searchEngine: AbstractSimpleSearchEngine<C, T>
  ) {
    super(resultProvider, searchEngine)
    this.resultProvider = resultProvider
    this.searchEngine = searchEngine
  }

  /**
   * Performs a simple search operation and sets the results in the provider.
   *
   * @param searchText - The search term to query for
   * @param page - The page number for pagination (defaults to 0)
   * @returns An Observable that emits the search results
   */
  public searchAndSetProvider(searchText: string, page: number = 0): Observable<T> {
    return this.searchEngine
      .search(searchText, page)
      .pipe(tap((result) => this.resultProvider.setSearchResults(result)))
  }

  /**
   * Performs a simple search operation and updates existing results in the provider.
   *
   * @param searchText - The search term to query for
   * @param page - The page number for pagination
   * @returns An Observable that emits the updated search results
   */
  public searchAndUpdateProvider(searchText: string, page: number): Observable<T> {
    return this.searchEngine
      .search(searchText, page)
      .pipe(tap((result) => this.resultProvider.updateSearchResults(result)))
  }
}
