import { AbstractSimpleSearchEngine } from '../../../Abstract/Engine/AbstractSimpleSearchEngine.service'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ProfileListEntry } from 'src/app/model/Search/ListEntries/ProfileListEntry'
import { ProfileResultList } from 'src/app/model/Search/ResultList/ProfileResultList'
import { ProfileResultMapperStrategy } from '../Mapper/ProfileResultMapperStrategy.service'
import { ProfileSearchUrlStrategy } from '../Url/ProfileSearchUrlStrategy'
import { SearchEngine } from '../../../SearchEngine'
import { SearchUrlBuilder } from '../../../UrlBuilder/SearchUrlBuilder'
import { ProfileSearchFilterProviderService } from '../../../Filter/ProfileSearchFilterProvider.service'
import { toSignal } from '@angular/core/rxjs-interop'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchEngineService extends AbstractSimpleSearchEngine<
  ProfileListEntry,
  ProfileResultList
> {
  protected searchEngine: SearchEngine<ProfileListEntry, ProfileResultList>
  private searchResultProcessorService =
    inject<SearchEngine<ProfileListEntry, ProfileResultList>>(SearchEngine)
  private profileSearchFilterProviderService = inject(ProfileSearchFilterProviderService)
  private readonly selectedModules = toSignal(
    this.profileSearchFilterProviderService.getSelectedModules(),
    { initialValue: [] as string[] }
  )
  constructor() {
    const searchEngine = inject<SearchEngine<ProfileListEntry, ProfileResultList>>(SearchEngine)

    super(searchEngine)
    this.searchEngine = searchEngine
  }

  public search(
    searchText: string,
    page: number = 0,
    pageSize: number = SearchUrlBuilder.MAX_ENTRIES_PER_PAGE
  ): Observable<ProfileResultList> {
    const resultMapper = this.getMapping()
    const url = this.createUrl(searchText, page, pageSize)
    return this.searchResultProcessorService.fetchAndMapSearchResults(url, resultMapper)
  }

  protected createUrl(
    searchText: string,
    page: number = 0,
    pageSize: number = SearchUrlBuilder.MAX_ENTRIES_PER_PAGE
  ): string {
    const modules = this.selectedModules().join(',')
    return new ProfileSearchUrlStrategy(searchText, modules).getSearchUrl(page, pageSize)
  }

  protected getMapping(): ProfileResultMapperStrategy {
    return new ProfileResultMapperStrategy()
  }
}
