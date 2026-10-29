import { inject, Injectable } from '@angular/core'
import { filter, Observable } from 'rxjs'
import { ProfileListEntry } from 'src/app/model/Search/ListEntries/ProfileListEntry'
import { ProfileResultList } from 'src/app/model/Search/ResultList/ProfileResultList'
import { AbstractSimpleSearch } from '../../Abstract/AbstractSimpleSearch'
import { ProfileSearchPaginationService } from './Pagination/ProfileSearchPagination.service'
import { ProfileSearchStateService } from './ProfileSearchState.service'
import { ProfileSearchResultProviderService } from './Result/ProfileSearchResultProvider.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchService extends AbstractSimpleSearch<ProfileListEntry, ProfileResultList> {
  private readonly paginator = inject(ProfileSearchPaginationService)
  private readonly profileSearchStateService = inject(ProfileSearchStateService)

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

  public loadNextPage(searchTerm: string): Observable<ProfileResultList> {
    this.setSearchTerm(searchTerm)
    return this.paginator.loadNextPage(searchTerm)
  }

  /**
   * Returns the search results.
   *
   * @returns {Observable<ProfileResultList>
   */
  public getSearchResults(): Observable<ProfileResultList> {
    return this.resultProviderService.getSearchResults().pipe(filter(Boolean))
  }

  public getActiveSearchTerm(): Observable<string> {
    return this.profileSearchStateService.getActiveSearchTerm()
  }

  protected setSearchTerm(searchTerm: string): void {
    this.profileSearchStateService.setActiveSearchTerm(searchTerm)
  }
}
