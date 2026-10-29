import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ProfileEntryDetailsData } from '../../../model/Interface/ListEntryDetailsData/ProfileEntryDetailsData'
import { ProfileEntryDetails } from '../../../model/Search/EntryDetails/Profile/ProfileEntryDetails'
import { ProfileEntryRelative } from '../../../model/Search/EntryDetails/Profile/ProfileEntryRelative'
import { DataSelectionApiService } from '../../Backend/Api/DataSelectionApi.service'
import { AbstractEntryDetailsService } from './AbstractEntryDetailsService'

@Injectable({
  providedIn: 'root',
})
export class ProfileEntryDetailsService extends AbstractEntryDetailsService<ProfileEntryRelative, ProfileEntryDetails> {
  private readonly dataSelectionApiService = inject(DataSelectionApiService)

  /**
   * Loads the details a single search result entry
   * @param {string} id
   * @returns {Observable<ProfileEntryDetails>}
   */
  public loadDetails(id: string): Observable<ProfileEntryDetails> {
    return this.dataSelectionApiService
      .getDataSelectionProfileEntryDetails(id)
      .pipe(map((response: ProfileEntryDetailsData) => ProfileEntryDetails.fromJson(response)))
  }
}
