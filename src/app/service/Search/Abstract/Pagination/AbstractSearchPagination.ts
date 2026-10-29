import { Observable } from 'rxjs'
import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { AbstractResultList } from 'src/app/model/Search/ResultList/AbstractResultList'
import { AbstractSearchMediatorService } from '../Mediator/AbstractSearchMediator'

/**
 * @abstract
 * Serves as the foundation for all pagination implementations, managing page state
 * and coordinating with mediator services for paginated search operations.
 *
 * @template C - Type extending AbstractListEntry representing individual search result entries
 * @template T - Type extending AbstractResultList representing the complete search result list
 */
export abstract class AbstractSearchPagination<C extends AbstractListEntry, T extends AbstractResultList<C>> {
  /**
   * The current page number for pagination tracking.
   * @protected
   */
  protected currentPage = 0

  /**
   * Creates an instance of AbstractSearchPagination.
   *
   * @param {AbstractSearchMediatorService<C, T>} mediatorService - The mediator service for coordinating search operations
   * @protected
   */
  constructor(protected mediatorService: AbstractSearchMediatorService<C, T>) {}

  /**
   * Resets the pagination.
   * @protected
   * Resets pagination state to initial values.
   * Sets the current page back to 0 for new search operations.
   */
  protected resetPagination(): void {
    this.currentPage = 0
  }

  /**
   * @abstract
   * @protected
   * Core pagination method that handles loading the next page of results.
   * Implementations must define how to retrieve subsequent pages of search results.
   *
   * @param {string} searchTerm - The search term to search for
   * @param {any[]} params - Additional parameters for the search operation
   * @returns {Observable<T>} An Observable that emits the next page of search results
   */
  protected abstract loadNextPage(searchTerm: string, ...params: any[]): Observable<T>

  /**
   * @abstract
   * @protected
   * Searches for the first page of results and resets pagination state.
   * Implementations must define how to initiate a new paginated search.
   *
   * @param {string} searchTerm - The search term to search for
   * @param {string[]} dataSetUrls - Optional array of dataset URLs to search within
   * @returns {Observable<T>} An Observable that emits the first page of search results
   */
  protected abstract searchFirstPage(searchTerm: string, dataSetUrls?: string[]): Observable<T>
}
