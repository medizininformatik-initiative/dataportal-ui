import { inject, Injectable } from '@angular/core'
import { ProfileListEntry } from 'src/app/model/Search/ListEntries/ProfileListEntry'
import { ProfileResultList } from 'src/app/model/Search/ResultList/ProfileResultList'
import { ProfileSearchMediatorService } from '../Mediator/ProfileSearchMediator.service'
import { SimpleSearchPagination } from '../../../Abstract/Pagination/SimpleSearchPagination'

@Injectable({ providedIn: 'root' })
export class ProfileSearchPaginationService extends SimpleSearchPagination<
  ProfileListEntry,
  ProfileResultList
> {
  protected mediator: ProfileSearchMediatorService

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    const mediator = inject(ProfileSearchMediatorService)

    super(mediator)
    this.mediator = mediator
  }
}
