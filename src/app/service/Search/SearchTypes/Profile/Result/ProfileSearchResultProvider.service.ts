import { AbstractSimpleSearchResultProvider } from '../../../Abstract/Result/AbstractSimpleSearchResultProvider.service'
import { Injectable } from '@angular/core'
import { ProfileListEntry } from 'src/app/model/Search/ListEntries/ProfileListEntry'
import { ProfileResultList } from 'src/app/model/Search/ResultList/ProfileResultList'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchResultProviderService extends AbstractSimpleSearchResultProvider<
  ProfileListEntry,
  ProfileResultList
> {}
