import { BackendService } from '../Backend.service';
import { BulkSearchPostData } from 'src/app/model/Interface/BulkSearchPostData';
import { BulkSearchResponseData } from 'src/app/model/Interface/BulkSearchResponseData';
import { ChunkedRequestService } from './ChunkedRequest.service';
import { CriteriaListEntryData } from 'src/app/model/Interface/Search/CriteriaListListEntryData';
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData';
import { CriteriaRelationsData } from 'src/app/model/Interface/CriteriaRelationsData';
import { CriteriaSearchFilterData } from 'src/app/model/Interface/Search/CriteriaSearchFilterData';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListEntryData } from 'src/app/model/Interface/Search/ListEntryData';
import { Observable } from 'rxjs';
import { ResultListData } from 'src/app/model/Interface/Search/ResultListData';
import { TerminologyPaths } from '../Paths/TerminologyPaths';
import { TerminologySystemData } from 'src/app/model/Interface/TerminologySystemData';
import { TypeAssertion } from '../../TypeGuard/TypeAssersations';
import { TypeGuard } from '../../TypeGuard/TypeGuard';
import { UiProfileData } from 'src/app/model/Interface/UiProfileData';

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
    const context = BackendService.createTypeGuardContext(TypeGuard.isCriteriaSearchFilterDataArray);
    return this.http.get<Array<CriteriaSearchFilterData>>(
      this.backendService.createUrl(TerminologyPaths.SEARCH_FILTER_ENDPOINT),
      { context }
    );
  }

  /**
   * Retrieves criteria profile data by their IDs.
   * @param ids - The IDs of the criteria profiles.
   * @returns - An observable containing the criteria profile data.
   */
  public getCriteriaProfileData(ids: string[]): Observable<Array<CriteriaProfileData>> {
    const context = BackendService.createAssertContextToken(
      TypeAssertion.assertCriteriaProfileDataArray
    );
    return this.chunkedRequestService.getChunkedRequest(
      ids,
      TerminologyPaths.CRITERIA_PROFILE_ENDPOINT,
      context
    );
  }

  /**
   * @todo: Define proper return type
   * @param id
   * @returns
   */
  public getSearchTermEntryRelations(id: string): Observable<CriteriaRelationsData> {
    const context = BackendService.createAssertContextToken(
      TypeAssertion.assertCriteriaRelationsData
    );
    const url = this.backendService.createUrl(
      TerminologyPaths.ENTRY_ENDPOINT + '/' + id + TerminologyPaths.RELATIONS_ENDPOINT
    );
    return this.http.get<CriteriaRelationsData>(url, { context });
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
    const context = BackendService.createAssertContextToken(
      TypeAssertion.assertCriteriaListListEntryData
    );
    const url = this.backendService.createUrl(TerminologyPaths.ENTRY_ENDPOINT + '/' + id);
    return this.http.get<CriteriaListEntryData>(url, { context });
  }

  /**
   *
   * @returns
   */
  public getTerminologySystems(): Observable<TerminologySystemData[]> {
    const context = BackendService.createAssertContextToken(
      TypeAssertion.assertTerminologySystemDataArray
    );
    const url = this.backendService.createUrl(TerminologyPaths.SYSTEMS_ENDPOINT);
    return this.http.get<TerminologySystemData[]>(url, { context });
  }

  /**
   * Retrieves UI Profile data from the backend.
   * @returns An observable containing the UI profile data.
   */
  public getUiProfileData(): Observable<UiProfileData[]> {
    const context = BackendService.createTypeGuardContext(TypeGuard.isUiProfileDataList);
    return this.http.get<UiProfileData[]>(
      this.backendService.createUrl(TerminologyPaths.UIPROFILE_ENDPOINT),
      { context }
    );
  }

  /**
   * Posts a bulk search request to the terminology endpoint.
   * @param body - The request body for the bulk search.
   * @returns
   */
  public postTerminologyBulkSearch(body: BulkSearchPostData): Observable<BulkSearchResponseData> {
    const context = BackendService.createTypeGuardContext(TypeGuard.isBulkSearchResponseData);
    return this.http.post<BulkSearchResponseData>(
      this.backendService.createUrl(TerminologyPaths.BULK_SEARCH_ENDPOINT),
      body,
      { context }
    );
  }
}
