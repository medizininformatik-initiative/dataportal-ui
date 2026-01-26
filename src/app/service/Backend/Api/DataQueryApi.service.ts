import { BackendService } from '../Backend.service';
import { CRTDLData } from 'src/app/model/Interface/CRTDLData';
import { DataqueryPaths } from '../Paths/DataqueryPaths';
import { DataQuerySlots } from 'src/app/model/SavedDataQuery/DataQuerySlots';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SavedDataQuery } from 'src/app/model/SavedDataQuery/SavedDataQuery';
import { SavedDataQueryData } from 'src/app/model/Interface/SavedDataQueryData';
import { SavedDataQueryListItemData } from 'src/app/model/Interface/SavedDataQueryListItemData';

@Injectable({
  providedIn: 'root',
})
export class DataQueryApiService {
  constructor(private http: HttpClient, private backendService: BackendService) {}

  public postDataQuery(dataQuery: SavedDataQueryData): Observable<HttpResponse<any>> {
    const url = this.backendService.createUrl(DataqueryPaths.DATA);
    return this.http.post<any>(url, dataQuery, {
      headers: this.backendService.getHeaders(),
      observe: 'response',
    });
  }

  public getDataQuery(): Observable<SavedDataQueryListItemData[]> {
    const url = this.backendService.createUrl(DataqueryPaths.DATA);
    return this.http.get<SavedDataQueryListItemData[]>(url, {
      headers: this.backendService.getHeaders(),
    });
  }

  public getDataQueryById(
    dataQueryId: number,
    skipValidation: boolean = false
  ): Observable<SavedDataQueryData> {
    const skip = DataqueryPaths.SKIP_VALIDATION + skipValidation;
    const url = this.backendService.createUrl(DataqueryPaths.DATA) + '/' + dataQueryId + skip;
    return this.http.get<SavedDataQueryData>(url, {
      headers: this.backendService.getHeaders(),
    });
  }

  public putDataQueryById(
    dataQueryId: number,
    dataQuery: SavedDataQuery
  ): Observable<SavedDataQueryData> {
    const url = this.backendService.createUrl(DataqueryPaths.DATA) + '/' + dataQueryId;
    return this.http.put<SavedDataQueryData>(url, dataQuery, {
      headers: this.backendService.getHeaders(),
    });
  }

  public deleteDataQueryById(dataQueryId: number): Observable<SavedDataQueryData> {
    const url = this.backendService.createUrl(DataqueryPaths.DATA) + '/' + dataQueryId;
    return this.http.delete<SavedDataQueryData>(url, {
      headers: this.backendService.getHeaders(),
    });
  }

  public getDatQueryCrtdl(): Observable<CRTDLData> {
    return this.http.get<CRTDLData>(this.backendService.createUrl(DataqueryPaths.CRTDL), {
      headers: this.backendService.getHeaders(),
    });
  }

  public getSavedDataQuerySlots(): Observable<DataQuerySlots> {
    return this.http.get<DataQuerySlots>(
      this.backendService.createUrl(DataqueryPaths.SAVED_QUERY_SLOTS),
      {
        headers: this.backendService.getHeaders(),
      }
    );
  }
}
