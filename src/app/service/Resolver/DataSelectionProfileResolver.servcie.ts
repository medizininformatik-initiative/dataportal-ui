import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ProfileResultList } from 'src/app/model/Search/ResultList/ProfileResultList'
import { ProfileSearchService } from '../Search/SearchTypes/Profile/ProfileSearch.service'

@Injectable({
  providedIn: 'root',
})
export class DataSelectionProfileResolverService {
  private profileSearchService = inject(ProfileSearchService)

  constructor() {}

  /**
   * Resolves the data selection profiles by fetching it from the backend.
   * @returns An observable containing the data selection profile results.
   */
  public resolve(): Observable<ProfileResultList> {
    return this.profileSearchService.search('')
  }
}
