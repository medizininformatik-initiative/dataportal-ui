import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter'
import { inject, Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { ProfileSearchFilterProviderService } from '../Search/Filter/ProfileSearchFilterProvider.service'
import { ProfileSearchFilterService } from '../Search/Filter/ProfileSearchFilter.service'
import { ProfileSearchFilter } from 'src/app/model/Search/Filter/ProfileSearchFilter'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchFilterResolverService {
  private profileSearchFilterService = inject(ProfileSearchFilterService)
  private filterProvider = inject(ProfileSearchFilterProviderService)

  constructor() {}

  /**
   * Resolves the criteria search filters by fetching them from the backend.
   * @returns An observable containing an array of criteria search filters.
   */
  public resolve(): Observable<ProfileSearchFilter[]> {
    return this.profileSearchFilterService.fetchFilter().pipe(
      tap((filters: ProfileSearchFilter[]) => {
        this.filterProvider.setProfileSearchFilters(filters)
      })
    )
  }
}
