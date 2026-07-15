import { AbstractKeyedSearchEngineService } from '../../../Abstract/Engine/AbstractKeyedSearchEngine.service'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ProfileListEntry } from 'src/app/model/Search/ListEntries/ProfileListEntry'
import { ProfileResultList } from 'src/app/model/Search/ResultList/ProfileResultList'
import { SearchEngine } from '../../../SearchEngine'
import { ProfileResultMapperStrategy } from '../Mapper/ProfileResultMapperStrategy.service'
import { ProfileSearchUrlStrategy } from '../Url/ProfileSearchUrlStrategy'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchEngineService extends AbstractKeyedSearchEngineService<
  ProfileListEntry,
  ProfileResultList
> {
  protected searchEngine: SearchEngine<ProfileListEntry, ProfileResultList>
  private searchResultProcessorService =
    inject<SearchEngine<ProfileListEntry, ProfileResultList>>(SearchEngine)

  constructor() {
    const searchEngine = inject<SearchEngine<ProfileListEntry, ProfileResultList>>(SearchEngine)

    super(searchEngine)
    this.searchEngine = searchEngine
  }

  public search(searchText: string, page: number = 0): Observable<ProfileResultList> {
    const resultMapper = this.getMapping()
    const url = this.createUrl(searchText, page)
    return this.searchResultProcessorService.fetchAndMapSearchResults(url, resultMapper)
  }

  protected createUrl(searchText: string, page: number = 0): string {
    return new ProfileSearchUrlStrategy(searchText).getSearchUrl(page)
  }

  protected getMapping(): ProfileResultMapperStrategy {
    return new ProfileResultMapperStrategy()
  }
}
