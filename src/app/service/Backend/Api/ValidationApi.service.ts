import { BackendService } from '../Backend.service';
import { CRTDLData } from 'src/app/model/Interface/CRTDLData';
import { DataqueryData } from 'src/app/model/Interface/DataqueryData';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ValidationPaths } from '../Paths/ValidationPaths';
import { ValidationResponseData } from 'src/app/core/model/Validation/ValidationResponseData';

@Injectable({
  providedIn: 'root',
})
export class ValidationApiService {
  constructor(private backendService: BackendService, private http: HttpClient) {}

  public validateDataQuery(
    dataquery: DataqueryData
  ): Observable<HttpResponse<ValidationResponseData>> {
    const url = this.backendService.createUrl(ValidationPaths.VALIDATE_DATAQUERY);
    return this.http.post<ValidationResponseData>(url, dataquery, {
      headers: this.backendService.getHeaders(),
      observe: 'response',
    });
  }

  public validateCRTDL(crtdl: CRTDLData): Observable<HttpResponse<void>> {
    const url = this.backendService.createUrl(ValidationPaths.VALIDATE_CRTDL);
    return this.http.post<void>(url, crtdl, {
      headers: this.backendService.getHeaders(),
      observe: 'response',
    });
  }
}
