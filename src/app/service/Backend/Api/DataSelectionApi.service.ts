import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ProfileEntryDetailsData } from 'src/app/model/Interface/ListEntryDetailsData/ProfileEntryDetailsData'
import { ListEntryData } from 'src/app/model/Interface/Search/ListEntryData'
import { ResultListData } from 'src/app/model/Interface/Search/ResultListData'
import { BackendService } from '../Backend.service'
import { DataSelectionPaths } from '../Paths/DataSelectionPaths'
import { ChunkedRequestService } from './ChunkedRequest.service'

@Injectable({
  providedIn: 'root',
})
export class DataSelectionApiService {
  private readonly http = inject(HttpClient)
  private readonly backendService = inject(BackendService)
  private readonly chunkedRequestService = inject(ChunkedRequestService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public getDataSelectionProfileData(ids: string[]) {
    const path = DataSelectionPaths.PROFILE_DATA_ENDPOINT
    return this.chunkedRequestService.getChunkedRequest(ids, path)
  }

  /**
   * Returns an observable containing the search results for data selection profiles.
   * @returns {Observable<ResultListData<T>>}
   */
  public getDataSelectionProfilSearchResults<T extends ListEntryData>(): Observable<ResultListData<T>> {
    const parsedUrl = this.backendService.createUrl(DataSelectionPaths.PROFILE_SEARCH_ENDPOINT)
    return this.http.get<ResultListData<T>>(parsedUrl)
  }

  public getDataSelectionProfileEntryDetails(id: string): Observable<ProfileEntryDetailsData> {
    const parsedUrl =
      this.backendService.createUrl(DataSelectionPaths.PROFILE_ENTRY_DETAILS_ENDPOINT) +
      `/${id}/${DataSelectionPaths.PROFILE_ENTRY_DETAILS_LIST_ENDPOINT}`
    return this.http.get<ProfileEntryDetailsData>(parsedUrl)
  }

  public getProfileSearchFilter(url?: string) {
    const parsedUrl = this.backendService.createUrl(url ?? DataSelectionPaths.PROFILE_SEARCH_FILTER)
    return this.http.get<any>(parsedUrl)
  }
}
