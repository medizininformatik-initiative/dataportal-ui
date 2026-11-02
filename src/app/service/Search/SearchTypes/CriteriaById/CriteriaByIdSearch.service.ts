import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { AbstractSearch } from '../../Abstract/AbstractSearch'
import { CriteriaSearchResultProviderService } from '../Criteria/Result/CriteriaSearchResultProvider.service'
import { CriteriaSearchSigleEntryEngineService } from './Engine/CriteriaSearchSingleEntryEngine.service'

@Injectable({
  providedIn: 'root',
})
export class CriteriaByIdSearchService extends AbstractSearch<CriteriaListEntry, CriteriaResultList> {
  private readonly criteriaSearchSingleEntryEngineService = inject(CriteriaSearchSigleEntryEngineService)
  private readonly resultProvider: CriteriaSearchResultProviderService

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    const resultProvider = inject(CriteriaSearchResultProviderService)

    super(resultProvider)
    this.resultProvider = resultProvider
  }
  /**
   * Searches for the criteria entry with the given id.
   * @param {string} id
   * @returns {Observable<CriteriaResultList>}
   */
  public search(id: string): Observable<CriteriaResultList> {
    return this.criteriaSearchSingleEntryEngineService.search(id)
  }

  /**
   * Not supported, a search by id has a single page.
   * @returns {Observable<CriteriaResultList>}
   */
  public loadNextPage(): Observable<CriteriaResultList> {
    throw new Error('Method not implemented.')
  }

  /**
   * Returns the search results.
   * @returns {Observable<CriteriaResultList>}
   */
  public getSearchResults(): Observable<CriteriaResultList> {
    return this.resultProvider.getSearchResults()
  }

  /**
   * Not supported, a search by id has no search term.
   */
  protected setSearchTerm(): void {
    throw new Error('Method not implemented.')
  }
}
