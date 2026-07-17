import { AbstractSimpleSearchMediator } from '../../../Abstract/Mediator/AbstractSimpleSearchMediator'
import { inject, Injectable } from '@angular/core'
import { ProfileListEntry } from 'src/app/model/Search/ListEntries/ProfileListEntry'
import { ProfileResultList } from 'src/app/model/Search/ResultList/ProfileResultList'
import { ProfileSearchEngineService } from '../Engine/ProfileSearchEngine.service'
import { ProfileSearchResultProviderService } from '../Result/ProfileSearchResultProvider.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchMediatorService extends AbstractSimpleSearchMediator<
  ProfileListEntry,
  ProfileResultList
> {
  private profileSearchEngine: ProfileSearchEngineService
  private profileSearchResultProviderService: ProfileSearchResultProviderService

  constructor(...args: unknown[])

  constructor() {
    const profileSearchEngine = inject(ProfileSearchEngineService)
    const profileSearchResultProviderService = inject(ProfileSearchResultProviderService)

    super(profileSearchResultProviderService, profileSearchEngine)
    this.profileSearchEngine = profileSearchEngine
    this.profileSearchResultProviderService = profileSearchResultProviderService
  }
}
