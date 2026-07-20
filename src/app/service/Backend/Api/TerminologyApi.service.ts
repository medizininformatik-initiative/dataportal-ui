import { BackendService } from '../Backend.service'
import { BulkSearchPostData } from 'src/app/model/Interface/BulkSearchPostData'
import { BulkSearchResponseData } from 'src/app/model/Interface/BulkSearchResponseData'
import { ChunkedRequestService } from './ChunkedRequest.service'
import { CriteriaListEntryData } from 'src/app/model/Interface/Search/CriteriaListListEntryData'
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData'
import { CriteriaSearchFilterData } from 'src/app/model/Interface/Search/CriteriaSearchFilterData'
import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { ListEntryData } from 'src/app/model/Interface/Search/ListEntryData'
import { Observable } from 'rxjs'
import { ResultListData } from 'src/app/model/Interface/Search/ResultListData'
import { TerminologyPaths } from '../Paths/TerminologyPaths'
import { UiProfileData } from 'src/app/model/Interface/UiProfileData'

@Injectable({
  providedIn: 'root',
})
export class TerminologyApiService {
  private backendService = inject(BackendService)
  private http = inject(HttpClient)
  private chunkedRequestService = inject(ChunkedRequestService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Retrieves the search filter options.
   * @returns - An observable containing the search filter options.
   */
  public getSearchFilter(url: string): Observable<Array<CriteriaSearchFilterData>> {
    const parsedUrl = this.backendService.createUrl(url)
    return this.http.get<Array<CriteriaSearchFilterData>>(this.backendService.createUrl(url))
  }

  /**
   * Retrieves criteria profile data by their IDs.
   * @param ids - The IDs of the criteria profiles.
   * @returns - An observable containing the criteria profile data.
   */
  public getCriteriaProfileData(ids: string[]): Observable<Array<CriteriaProfileData>> {
    return this.chunkedRequestService.getChunkedRequest(
      ids,
      TerminologyPaths.CRITERIA_PROFILE_ENDPOINT
    )
  }

  /**
   * @todo: Define proper return type
   * @param id
   * @returns
   */
  public getCriteriaEntryRelations(id: string): Observable<any> {
    return this.http.get<any>(
      this.backendService.createUrl(
        TerminologyPaths.ENTRY_ENDPOINT + '/' + id + TerminologyPaths.RELATIONS_ENDPOINT
      )
    )
  }

  /**
   * Retrieves the elastic search results.
   * @param url - The URL for the elastic search request.
   * @returns - An observable containing the search results.
   */
  public getSearchResults<T extends ListEntryData>(url: string): Observable<ResultListData<T>> {
    const parsedUrl = this.backendService.createUrl(url)
    return this.http.get<ResultListData<T>>(parsedUrl)
  }

  /**
   * Retrieves a specific entry by its ID.
   * @param id - The ID of the entry to retrieve.
   * @returns - An observable containing the entry data.
   */
  public getEntryById(id: string): Observable<CriteriaListEntryData> {
    return this.http.get<CriteriaListEntryData>(
      this.backendService.createUrl(TerminologyPaths.ENTRY_ENDPOINT + '/' + id)
    )
  }

  /**
   *
   * @returns
   */
  public getTerminologySystems() {
    return this.http.get<any>(this.backendService.createUrl(TerminologyPaths.SYSTEMS_ENDPOINT))
  }

  /**
   * Retrieves UI Profile data from the backend.
   * @returns An observable containing the UI Profile data.
   */
  public getUiProfileData(): Observable<UiProfileData[]> {
    return this.http.get<UiProfileData[]>(
      this.backendService.createUrl(TerminologyPaths.UIPROFILE_ENDPOINT)
    )
  }

  /**
   * Posts a bulk search request to the terminology endpoint.
   * @param body - The request body for the bulk search.
   * @returns
   */
  public postTerminologyBulkSearch(body: BulkSearchPostData): Observable<BulkSearchResponseData> {
    return this.http.post<BulkSearchResponseData>(
      this.backendService.createUrl(TerminologyPaths.BULK_SEARCH_ENDPOINT),
      body
    )
  }
}
