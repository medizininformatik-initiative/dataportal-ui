import { Injectable, inject } from '@angular/core'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { SimpleSearchPagination } from '../../../Abstract/Pagination/SimpleSearchPagination'
import { CriteriaSearchMediatorService } from '../Mediator/CriteriaSearchMediator.service'

@Injectable({ providedIn: 'root' })
export class CriteriaSearchPaginationService extends SimpleSearchPagination<CriteriaListEntry, CriteriaResultList> {
  protected mediator: CriteriaSearchMediatorService

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    const mediator = inject(CriteriaSearchMediatorService)

    super(mediator)
    this.mediator = mediator
  }
}
