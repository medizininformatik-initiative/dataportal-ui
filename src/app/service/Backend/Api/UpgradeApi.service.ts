import { BackendService } from '../Backend.service';
import { CRTDLData } from 'src/app/model/Interface/CRTDLData';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UpgradeData } from 'src/app/core/model/Upgrade/UpgradeData';
import { UpgradePaths } from '../Paths/UpgradePaths';

@Injectable({
  providedIn: 'root',
})
export class UpgradeApiService {
  constructor(private backendService: BackendService, private http: HttpClient) {}

  public upgradeCRTDL(crtdl: CRTDLData): Observable<HttpResponse<UpgradeData>> {
    const url = this.backendService.createUrl(UpgradePaths.UPGRADE_CRTDL);
    const response$ = this.http.post<UpgradeData>(url, crtdl, {
      context: BackendService.getValidationContextToken(),
      observe: 'response',
    });
    return response$;
  }
}
