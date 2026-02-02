import { ActuatorData } from 'src/app/model/Interface/ActuatorInfoData/ActuatorData';
import { ActuatorPaths } from '../Paths/ActuatorPath';
import { BackendService } from '../Backend.service';
import { BuildInformationData } from 'src/app/model/Interface/ActuatorInfoData/BuildInformationData';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActuatorApiService {
  constructor(private http: HttpClient, private backendService: BackendService) {}

  public getActuatorInfo(): Observable<ActuatorData> {
    return this.http.get<ActuatorData>(this.backendService.createUrl(ActuatorPaths.INFO_ENDPOINT), {
      headers: this.backendService.getHeaders(),
    });
  }

  public getActuatorHealth(): Observable<BuildInformationData> {
    return this.http.get<any>(this.backendService.createUrl(ActuatorPaths.HEALTH_ENDPOINT), {
      headers: this.backendService.getHeaders(),
    });
  }
}
