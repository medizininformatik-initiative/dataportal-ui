import { AbstractSimpleSearch } from '../../Abstract/AbstractSimpleSearch'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ProfileListEntry } from 'src/app/model/Search/ListEntries/ProfileListEntry'
import { ProfileResultList } from 'src/app/model/Search/ResultList/ProfileResultList'
import { ProfileSearchPaginationService } from './Pagination/ProfileSearchPagination.service'
import { ProfileSearchResultProviderService } from './Result/ProfileSearchResultProvider.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchService extends AbstractSimpleSearch<
  ProfileListEntry,
  ProfileResultList
> {
  private paginator = inject(ProfileSearchPaginationService)
  //private criteriaSearchStateService = inject(ProfileSearchStateService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    const resultProvider = inject(ProfileSearchResultProviderService)

    super(resultProvider)
  }

  /**
   * Starts a new search with the given search term and sets the search term as active.
   * @param {string} searchTerm
   * @returns {Observable<ProfileResultList>}
   */
  public search(searchTerm: string): Observable<ProfileResultList> {
    this.setSearchTerm(searchTerm)
    return this.paginator.searchFirstPage(searchTerm)
  }

  /**
   * @param {string} searchTerm
   * @returns {Observable<ProfileResultList>}
   */
  public loadNextPage(searchTerm: string): Observable<ProfileResultList> {
    this.setSearchTerm(searchTerm)
    return this.paginator.loadNextPage(searchTerm)
  }

  /**
   *
   * @returns {Observable<ProfileResultList>
   */
  public getSearchResults(): Observable<ProfileResultList> {
    return this.resultProviderService.getSearchResults()
  }

  protected setSearchTerm(searchTerm: string) {
    //this.criteriaSearchStateService.setActiveSearchTerm(searchTerm)
  }
}
