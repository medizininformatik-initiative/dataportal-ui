import { AbstractSearch } from '../../Abstract/AbstractSearch'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { CriteriaSearchResultProviderService } from '../Criteria/Result/CriteriaSearchResultProvider.service'
import { CriteriaSearchSigleEntryEngineService } from './Engine/CriteriaSearchSingleEntryEngine.service'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CriteriaByIdSearchService extends AbstractSearch<
  CriteriaListEntry,
  CriteriaResultList
> {
  private criteriaSearchSingleEntryEngineService = inject(CriteriaSearchSigleEntryEngineService)
  private resultProvider: CriteriaSearchResultProviderService

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    const resultProvider = inject(CriteriaSearchResultProviderService)

    super(resultProvider)
    this.resultProvider = resultProvider
  }
  public search(id: string): Observable<CriteriaResultList> {
    return this.criteriaSearchSingleEntryEngineService.search(id)
  }

  public loadNextPage(): Observable<CriteriaResultList> {
    throw new Error('Method not implemented.')
  }

  public getSearchResults(): Observable<CriteriaResultList> {
    return this.resultProvider.getSearchResults()
  }

  protected setSearchTerm(): void {
    throw new Error('Method not implemented.')
  }
}
