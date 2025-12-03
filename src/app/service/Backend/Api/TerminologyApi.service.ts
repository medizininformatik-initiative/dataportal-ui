import { BackendService } from '../Backend.service';
import { ChunkedRequestService } from './ChunkedRequest.service';
import { CodeableConceptPaths } from '../Paths/CodeableConceptPaths';
import { ConceptData } from 'src/app/model/Interface/ConceptData';
import { CriteriaListEntryData } from 'src/app/model/Interface/Search/CriteriaListListEntryData';
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData';
import { CriteriaSearchFilterData } from 'src/app/model/Interface/Search/CriteriaSearchFilterData';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListEntryData } from 'src/app/model/Interface/Search/ListEntryData';
import { Observable } from 'rxjs';
import { ResultListData } from 'src/app/model/Interface/Search/ResultListData';
import { TerminologyPaths } from '../Paths/TerminologyPaths';
import { UiProfileResponseData } from '../../../model/Interface/UiProfileResponseData';
import { BulkSearchPostData } from 'src/app/model/Interface/BulkSearchPostData';
import { BulkSearchResponseData } from 'src/app/model/Interface/BulkSearchResponseData';

@Injectable({
  providedIn: 'root',
})
export class TerminologyApiService {
  constructor(
    private backendService: BackendService,
    private http: HttpClient,
    private chunkedRequestService: ChunkedRequestService
  ) {}

  /**
   * @todo: Define proper return type
   * Retrieves the search filter options.
   * @returns - An observable containing the search filter options.
   */
  public getSearchFilter(): Observable<Array<CriteriaSearchFilterData>> {
    return this.http.get<Array<CriteriaSearchFilterData>>(
      this.backendService.createUrl(TerminologyPaths.SEARCH_FILTER_ENDPOINT)
    );
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
    );
  }

  /**
   * @todo: Define proper return type
   * @param id
   * @returns
   */
  public getSearchTermEntryRelations(id: string): Observable<any> {
    return this.http.get<any>(
      this.backendService.createUrl(
        TerminologyPaths.ENTRY_ENDPOINT + '/' + id + TerminologyPaths.RELATIONS_ENDPOINT
      )
    );
  }

  /**
   * Retrieves the elastic search results.
   * @param url - The URL for the elastic search request.
   * @returns - An observable containing the search results.
   */
  public getSearchResults<T extends ListEntryData>(url: string): Observable<ResultListData<T>> {
    const parsedUrl = this.backendService.createUrl(url);
    return this.http.get<ResultListData<T>>(parsedUrl);
  }

  /**
   * Retrieves a specific entry by its ID.
   * @param id - The ID of the entry to retrieve.
   * @returns - An observable containing the entry data.
   */
  public getEntryById(id: string): Observable<CriteriaListEntryData> {
    return this.http.get<CriteriaListEntryData>(
      this.backendService.createUrl(TerminologyPaths.ENTRY_ENDPOINT + '/' + id)
    );
  }

  /**
   *
   * @returns
   */
  public getTerminologySystems() {
    return this.http.get<any>(this.backendService.createUrl(TerminologyPaths.SYSTEMS_ENDPOINT));
  }

  /**
   * Retrieves UI Profile data from the backend.
   * @returns
   */
  public getUiProfileData(): Observable<UiProfileResponseData[]> {
    return this.http.get<UiProfileResponseData[]>(
      this.backendService.createUrl(TerminologyPaths.UIPROFILE_ENDPOINT)
    );
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
    );
  }
}
