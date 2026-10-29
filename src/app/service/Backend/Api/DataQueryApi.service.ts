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

  public postDataQuery(dataQuery: SavedDataQueryData): Observable<HttpResponse<any>> {
    const url = this.backendService.createUrl(DataqueryPaths.DATA)
    return this.http.post<any>(url, dataQuery, {
      headers: this.backendService.getHeaders(),
      observe: 'response',
    })
  }

  public postConvertCrtdltToCsv(crtdlData: any): Observable<Blob> {
    const url = this.backendService.createUrl(DataqueryPaths.CONVERT_CRTDL)
    return this.http.post(url, crtdlData, {
      headers: this.backendService.getHeaders(),
      observe: 'body',
      responseType: 'blob',
    })
  }

  public getDataQuery(): Observable<SavedDataQueryListItemData[]> {
    const url = this.backendService.createUrl(DataqueryPaths.DATA)
    return this.http.get<SavedDataQueryListItemData[]>(url, {
      headers: this.backendService.getHeaders(),
    })
  }

  public getDataQueryById(dataQueryId: number, skipValidation: boolean = false): Observable<SavedDataQueryData> {
    const skip = DataqueryPaths.SKIP_VALIDATION + skipValidation
    const url = this.backendService.createUrl(DataqueryPaths.DATA) + '/' + dataQueryId + skip
    return this.http.get<SavedDataQueryData>(url, {
      headers: this.backendService.getHeaders(),
    })
  }

  public putDataQueryById(dataQueryId: number, dataQuery: SavedDataQuery): Observable<SavedDataQueryData> {
    const url = this.backendService.createUrl(DataqueryPaths.DATA) + '/' + dataQueryId
    return this.http.put<SavedDataQueryData>(url, dataQuery, {
      headers: this.backendService.getHeaders(),
    })
  }

  public deleteDataQueryById(dataQueryId: number): Observable<void> {
    const url = this.backendService.createUrl(DataqueryPaths.DATA) + '/' + dataQueryId
    return this.http.delete<void>(url, {
      headers: this.backendService.getHeaders(),
    })
  }

  public getDatQueryCrtdl(): Observable<CRTDLData> {
    return this.http.get<CRTDLData>(this.backendService.createUrl(DataqueryPaths.CRTDL), {
      headers: this.backendService.getHeaders(),
    })
  }

  public getSavedDataQuerySlots(): Observable<DataQuerySlots> {
    return this.http.get<DataQuerySlots>(this.backendService.createUrl(DataqueryPaths.SAVED_QUERY_SLOTS), {
      headers: this.backendService.getHeaders(),
    })
  }
}
