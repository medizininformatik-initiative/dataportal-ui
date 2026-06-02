import { AbstractSimpleSearchMediator } from '../../../Abstract/Mediator/AbstractSimpleSearchMediator'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { CriteriaSearchEngineService } from '../Engine/CriteriaSearchEngine'
import { CriteriaSearchResultProviderService } from '../Result/CriteriaSearchResultProvider.service'
import { Injectable, inject } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class CriteriaSearchMediatorService extends AbstractSimpleSearchMediator<
  CriteriaListEntry,
  CriteriaResultList
> {
  private criteriaSearchEngineService: CriteriaSearchEngineService
  private criteriaSearchResultProviderService: CriteriaSearchResultProviderService

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    const criteriaSearchEngineService = inject(CriteriaSearchEngineService)
    const criteriaSearchResultProviderService = inject(CriteriaSearchResultProviderService)

    super(criteriaSearchResultProviderService, criteriaSearchEngineService)
    this.criteriaSearchEngineService = criteriaSearchEngineService
    this.criteriaSearchResultProviderService = criteriaSearchResultProviderService
  }
}
