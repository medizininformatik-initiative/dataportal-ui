import { inject, Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter'
import { ProfileSearchFilter } from 'src/app/model/Search/Filter/ProfileSearchFilter'
import { ProfileSearchFilterService } from '../Search/Filter/ProfileSearchFilter.service'
import { ProfileSearchFilterProviderService } from '../Search/Filter/ProfileSearchFilterProvider.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchFilterResolverService {
  private readonly profileSearchFilterService = inject(ProfileSearchFilterService)
  private readonly filterProvider = inject(ProfileSearchFilterProviderService)

  constructor() {}

  /**
   * Resolves the criteria search filters by fetching them from the backend.
   * @returns {Observable<ProfileSearchFilter[]>} An observable containing an array of criteria search filters.
   */
  public resolve(): Observable<ProfileSearchFilter[]> {
    return this.profileSearchFilterService.fetchFilter().pipe(
      tap((filters: ProfileSearchFilter[]) => {
        this.filterProvider.setProfileSearchFilters(filters)
      })
    )
  }
}
