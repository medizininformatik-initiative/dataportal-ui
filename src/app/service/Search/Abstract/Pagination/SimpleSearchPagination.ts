import { Observable } from 'rxjs'
import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { AbstractResultList } from 'src/app/model/Search/ResultList/AbstractResultList'
import { AbstractSimpleSearchMediator } from '../Mediator/AbstractSimpleSearchMediator'
import { AbstractSearchPagination } from './AbstractSearchPagination'

/**
 * Implementation for pagination that works with single result sets.
 * Provides concrete implementations for simple pagination scenarios.
 */
export abstract class SimpleSearchPagination<C extends AbstractListEntry, T extends AbstractResultList<C>> extends AbstractSearchPagination<
  C,
  T
> {
  /**
   * The mediator for this pagination.
   * It is expected to be a simple search mediator.
   */
  protected mediator: AbstractSimpleSearchMediator<C, T>

  /**
   * Constructor for the simple search pagination.
   * @param {AbstractSimpleSearchMediator<C, T>} mediatorService The mediator service to use for delegating the search.
   */
  constructor(protected mediatorService: AbstractSimpleSearchMediator<C, T>) {
    super(mediatorService)
    this.mediator = mediatorService
  }

  /**
   * Performs initial search (first page) and sets results.
   * Resets pagination state before performing the search.
   * @param {string} searchTerm The search term to search for.
   * @returns {Observable<T>} An Observable that emits the search results.
   */
  public searchFirstPage(searchTerm: string): Observable<T> {
    this.resetPagination()
    return this.mediatorService.searchAndSetProvider(searchTerm, 0)
  }

  /**
   * Loads the next page of results and appends to existing results.
   * Increments the current page number before performing the search.
   * @param {string} searchTerm The search term to search for.
   * @returns {Observable<T>} An Observable that emits the search results.
   */
  public loadNextPage(searchTerm: string): Observable<T> {
    this.currentPage++
    return this.mediatorService.searchAndUpdateProvider(searchTerm, this.currentPage)
  }
}
