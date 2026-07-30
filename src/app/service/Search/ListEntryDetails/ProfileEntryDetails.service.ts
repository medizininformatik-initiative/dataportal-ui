import { AbstractEntryDetailsService } from './AbstractEntryDetailsService'
import { DataSelectionApiService } from '../../Backend/Api/DataSelectionApi.service'
import { Display } from '../../../model/DataSelection/Profile/Display'
import { inject, Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { ProfileEntryDetails } from '../../../model/Search/EntryDetails/Profile/ProfileEntryDetails'
import { ProfileEntryDetailsData } from '../../../model/Interface/ListEntryDetailsData/ProfileEntryDetailsData'
import { ProfileEntryRelative } from '../../../model/Search/EntryDetails/Profile/ProfileEntryRelative'
import { ProfileRelativeData } from '../../../model/Interface/ListEntryDetailsData/ProfileRelativeData'

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
      .pipe(map((response: ProfileEntryDetailsData) => this.mapProfileEntryDetailsData(response)))
  }

  private mapProfileEntryDetailsData(response: ProfileEntryDetailsData): ProfileEntryDetails {
    const display = Display.fromJson(response.display)
    const parents = this.mapRelativeData(response.parents)
    const children = this.mapRelativeData(response.children)
    const fields = response.fields.map((field) => Display.fromJson(field.display))
    return new ProfileEntryDetails(
      response.id,
      display,
      fields,
      parents,
      children,
      response.selectable,
      response.url
    )
  }

  protected mapRelativeData(relatives: ProfileRelativeData[]): ProfileEntryRelative[] {
    return relatives.map(
      (relative) =>
        new ProfileEntryRelative(relative.id, Display.fromJson(relative.display), relative.url)
    )
  }
}
