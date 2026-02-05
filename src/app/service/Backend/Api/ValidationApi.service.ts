import { BackendService } from '../Backend.service';
import { CRTDLData } from 'src/app/model/Interface/CRTDLData';
import { DataqueryData } from 'src/app/model/Interface/DataqueryData';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ValidationIssueData } from 'src/app/core/model/Validation/ValidationIssueData';
import { ValidationPaths } from '../Paths/ValidationPaths';

@Injectable({
  providedIn: 'root',
})
export class ValidationApiService {
  constructor(private backendService: BackendService, private http: HttpClient) {}

  public validateDataQuery(
    dataquery: DataqueryData
  ): Observable<HttpResponse<ValidationIssueData[]>> {
    const url = this.backendService.createUrl(ValidationPaths.VALIDATE_DATAQUERY);
    return this.http.post<ValidationIssueData[]>(url, dataquery, {
      context: BackendService.getValidationContextToken(),
      observe: 'response',
    });
  }

  public validateCRTDL(crtdl: CRTDLData): Observable<HttpResponse<void>> {
    const url = this.backendService.createUrl(ValidationPaths.VALIDATE_CRTDL);
    return this.http.post<void>(url, crtdl, {
      context: BackendService.getValidationContextToken(),
      observe: 'response',
    });
  }
}
