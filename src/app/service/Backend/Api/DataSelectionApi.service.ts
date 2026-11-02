import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { DataSelectionProfileData } from 'src/app/model/Interface/DataSelectionProfileData'
import { ProfileEntryDetailsData } from 'src/app/model/Interface/ListEntryDetailsData/ProfileEntryDetailsData'
import { SearchFilterData } from 'src/app/model/Interface/Search/Filter/SearchFilterData'
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

  /**
   * Fetches the profile data for the given ids in chunks.
   * @param {string[]} ids
   * @returns {Observable<DataSelectionProfileData[]>}
   */
  public getDataSelectionProfileData(ids: string[]): Observable<DataSelectionProfileData[]> {
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

  /**
   * Fetches the details of a profile entry.
   * @param {string} id
   * @returns {Observable<ProfileEntryDetailsData>}
   */
  public getDataSelectionProfileEntryDetails(id: string): Observable<ProfileEntryDetailsData> {
    const parsedUrl =
      this.backendService.createUrl(DataSelectionPaths.PROFILE_ENTRY_DETAILS_ENDPOINT) +
      `/${id}/${DataSelectionPaths.PROFILE_ENTRY_DETAILS_LIST_ENDPOINT}`
    return this.http.get<ProfileEntryDetailsData>(parsedUrl)
  }

  /**
   * Fetches the profile search filter, from the default endpoint if no url is given.
   * @param {string} url
   * @returns {Observable<SearchFilterData | SearchFilterData[]>}
   */
  public getProfileSearchFilter(url?: string): Observable<SearchFilterData | SearchFilterData[]> {
    const parsedUrl = this.backendService.createUrl(url ?? DataSelectionPaths.PROFILE_SEARCH_FILTER)
    return this.http.get<any>(parsedUrl)
  }
}
