import { Injectable } from '@angular/core'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { AbstractSimpleSearchResultProvider } from '../../../Abstract/Result/AbstractSimpleSearchResultProvider.service'

@Injectable({
  providedIn: 'root',
})
export class CriteriaSearchResultProviderService extends AbstractSimpleSearchResultProvider<CriteriaListEntry, CriteriaResultList> {}
