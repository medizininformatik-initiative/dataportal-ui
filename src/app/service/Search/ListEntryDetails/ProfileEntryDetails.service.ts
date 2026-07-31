import { AbstractEntryDetailsService } from './AbstractEntryDetailsService'
import { DataSelectionApiService } from '../../Backend/Api/DataSelectionApi.service'
import { inject, Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { ProfileEntryDetails } from '../../../model/Search/EntryDetails/Profile/ProfileEntryDetails'
import { ProfileEntryDetailsData } from '../../../model/Interface/ListEntryDetailsData/ProfileEntryDetailsData'
import { ProfileEntryRelative } from '../../../model/Search/EntryDetails/Profile/ProfileEntryRelative'

@Injectable({
  providedIn: 'root',
})
export class ProfileEntryDetailsService extends AbstractEntryDetailsService<
  ProfileEntryRelative,
  ProfileEntryDetails
> {
  private dataSelectionApiService = inject(DataSelectionApiService)

  /**
   * Loads the details a single search result entry
   * @param {string} id
   * @returns
   */
  public loadDetails(id: string): Observable<ProfileEntryDetails> {
    return this.dataSelectionApiService
      .getDataSelectionProfileEntryDetails(id)
      .pipe(map((response: ProfileEntryDetailsData) => ProfileEntryDetails.fromJson(response)))
  }
}
