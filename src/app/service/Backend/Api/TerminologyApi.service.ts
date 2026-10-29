import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { BulkSearchPostData } from 'src/app/model/Interface/BulkSearchPostData'
import { BulkSearchResponseData } from 'src/app/model/Interface/BulkSearchResponseData'
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData'
import { CriteriaListEntryData } from 'src/app/model/Interface/Search/CriteriaListListEntryData'
import { SearchFilterData } from 'src/app/model/Interface/Search/Filter/SearchFilterData'
import { ListEntryData } from 'src/app/model/Interface/Search/ListEntryData'
import { ResultListData } from 'src/app/model/Interface/Search/ResultListData'
import { UiProfileData } from 'src/app/model/Interface/UiProfileData'
import { BackendService } from '../Backend.service'
import { TerminologyPaths } from '../Paths/TerminologyPaths'
import { ChunkedRequestService } from './ChunkedRequest.service'

@Injectable({
  providedIn: 'root',
})
export class TerminologyApiService {
  private readonly backendService = inject(BackendService)
  private readonly http = inject(HttpClient)
  private readonly chunkedRequestService = inject(ChunkedRequestService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Retrieves the search filter options.
   * @returns {Observable<Array<SearchFilterData>>} - An observable containing the search filter options.
   * @param {string} url
   */
  public getSearchFilter(url: string): Observable<Array<SearchFilterData>> {
    const parsedUrl = this.backendService.createUrl(url)
    return this.http.get<Array<SearchFilterData>>(parsedUrl)
  }

  /**
   * Retrieves criteria profile data by their IDs.
   * @param {string[]} ids - The IDs of the criteria profiles.
   * @returns {Observable<Array<CriteriaProfileData>>} - An observable containing the criteria profile data.
   */
  public getCriteriaProfileData(ids: string[]): Observable<Array<CriteriaProfileData>> {
    return this.chunkedRequestService.getChunkedRequest(ids, TerminologyPaths.CRITERIA_PROFILE_ENDPOINT)
  }

  /**
   * Returns the criteria entry relations.
   * @todo: Define proper return type
   * @param {string} id
   * @returns {Observable<any>}
   */
  public getCriteriaEntryRelations(id: string): Observable<any> {
    return this.http.get<any>(
      this.backendService.createUrl(TerminologyPaths.ENTRY_ENDPOINT + '/' + id + TerminologyPaths.RELATIONS_ENDPOINT)
    )
  }

  /**
   * Retrieves the elastic search results.
   * @param {string} url - The URL for the elastic search request.
   * @returns {Observable<ResultListData<T>>} - An observable containing the search results.
   */
  public getSearchResults<T extends ListEntryData>(url: string): Observable<ResultListData<T>> {
    const parsedUrl = this.backendService.createUrl(url)
    return this.http.get<ResultListData<T>>(parsedUrl)
  }

  /**
   * Retrieves a specific entry by its ID.
   * @param {string} id - The ID of the entry to retrieve.
   * @returns {Observable<CriteriaListEntryData>} - An observable containing the entry data.
   */
  public getEntryById(id: string): Observable<CriteriaListEntryData> {
    return this.http.get<CriteriaListEntryData>(this.backendService.createUrl(TerminologyPaths.ENTRY_ENDPOINT + '/' + id))
  }

  public getTerminologySystems() {
    return this.http.get<any>(this.backendService.createUrl(TerminologyPaths.SYSTEMS_ENDPOINT))
  }

  /**
   * Retrieves UI Profile data from the backend.
   * @returns {Observable<UiProfileData[]>} An observable containing the UI Profile data.
   */
  public getUiProfileData(): Observable<UiProfileData[]> {
    return this.http.get<UiProfileData[]>(this.backendService.createUrl(TerminologyPaths.UIPROFILE_ENDPOINT))
  }

  /**
   * Posts a bulk search request to the terminology endpoint.
   * @param {BulkSearchPostData} body - The request body for the bulk search.
   * @returns {Observable<BulkSearchResponseData>}
   */
  public postTerminologyBulkSearch(body: BulkSearchPostData): Observable<BulkSearchResponseData> {
    return this.http.post<BulkSearchResponseData>(this.backendService.createUrl(TerminologyPaths.BULK_SEARCH_ENDPOINT), body)
  }
}
