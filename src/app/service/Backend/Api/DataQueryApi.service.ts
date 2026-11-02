import { HttpClient, HttpResponse } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { CRTDLData } from 'src/app/model/Interface/CRTDLData'
import { SavedDataQueryData } from 'src/app/model/Interface/SavedDataQueryData'
import { SavedDataQueryListItemData } from 'src/app/model/Interface/SavedDataQueryListItemData'
import { DataQuerySlots } from 'src/app/model/SavedDataQuery/DataQuerySlots'
import { SavedDataQuery } from 'src/app/model/SavedDataQuery/SavedDataQuery'
import { BackendService } from '../Backend.service'
import { DataqueryPaths } from '../Paths/DataqueryPaths'

@Injectable({
  providedIn: 'root',
})
export class DataQueryApiService {
  private readonly http = inject(HttpClient)
  private readonly backendService = inject(BackendService)

  constructor() {}

  /**
   * Saves a data query in the backend.
   * @param {SavedDataQueryData} dataQuery
   * @returns {Observable<HttpResponse<any>>}
   */
  public postDataQuery(dataQuery: SavedDataQueryData): Observable<HttpResponse<any>> {
    const url = this.backendService.createUrl(DataqueryPaths.DATA)
    return this.http.post<any>(url, dataQuery, {
      headers: this.backendService.getHeaders(),
      observe: 'response',
    })
  }

  /**
   * Converts a CRTDL to a CSV file.
   * @param {any} crtdlData
   * @returns {Observable<Blob>}
   */
  public postConvertCrtdltToCsv(crtdlData: any): Observable<Blob> {
    const url = this.backendService.createUrl(DataqueryPaths.CONVERT_CRTDL)
    return this.http.post(url, crtdlData, {
      headers: this.backendService.getHeaders(),
      observe: 'body',
      responseType: 'blob',
    })
  }

  /**
   * Fetches the list of saved data queries.
   * @returns {Observable<SavedDataQueryListItemData[]>}
   */
  public getDataQuery(): Observable<SavedDataQueryListItemData[]> {
    const url = this.backendService.createUrl(DataqueryPaths.DATA)
    return this.http.get<SavedDataQueryListItemData[]>(url, {
      headers: this.backendService.getHeaders(),
    })
  }

  /**
   * Fetches a saved data query, optionally skipping the validation.
   * @param {number} dataQueryId
   * @param {boolean} skipValidation
   * @returns {Observable<SavedDataQueryData>}
   */
  public getDataQueryById(dataQueryId: number, skipValidation: boolean = false): Observable<SavedDataQueryData> {
    const skip = DataqueryPaths.SKIP_VALIDATION + skipValidation
    const url = this.backendService.createUrl(DataqueryPaths.DATA) + '/' + dataQueryId + skip
    return this.http.get<SavedDataQueryData>(url, {
      headers: this.backendService.getHeaders(),
    })
  }

  /**
   * Updates a saved data query.
   * @param {number} dataQueryId
   * @param {SavedDataQuery} dataQuery
   * @returns {Observable<SavedDataQueryData>}
   */
  public putDataQueryById(dataQueryId: number, dataQuery: SavedDataQuery): Observable<SavedDataQueryData> {
    const url = this.backendService.createUrl(DataqueryPaths.DATA) + '/' + dataQueryId
    return this.http.put<SavedDataQueryData>(url, dataQuery, {
      headers: this.backendService.getHeaders(),
    })
  }

  /**
   * Deletes a saved data query.
   * @param {number} dataQueryId
   * @returns {Observable<void>}
   */
  public deleteDataQueryById(dataQueryId: number): Observable<void> {
    const url = this.backendService.createUrl(DataqueryPaths.DATA) + '/' + dataQueryId
    return this.http.delete<void>(url, {
      headers: this.backendService.getHeaders(),
    })
  }

  /**
   * Fetches the CRTDL of the data query.
   * @returns {Observable<CRTDLData>}
   */
  public getDatQueryCrtdl(): Observable<CRTDLData> {
    return this.http.get<CRTDLData>(this.backendService.createUrl(DataqueryPaths.CRTDL), {
      headers: this.backendService.getHeaders(),
    })
  }

  /**
   * Fetches the number of saved data query slots.
   * @returns {Observable<DataQuerySlots>}
   */
  public getSavedDataQuerySlots(): Observable<DataQuerySlots> {
    return this.http.get<DataQuerySlots>(this.backendService.createUrl(DataqueryPaths.SAVED_QUERY_SLOTS), {
      headers: this.backendService.getHeaders(),
    })
  }
}
