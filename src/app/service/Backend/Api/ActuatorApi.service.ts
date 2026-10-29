import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ActuatorData } from 'src/app/model/Interface/ActuatorInfoData/ActuatorData'
import { BuildInformationData } from 'src/app/model/Interface/ActuatorInfoData/BuildInformationData'
import { BackendService } from '../Backend.service'
import { ActuatorPaths } from '../Paths/ActuatorPath'

@Injectable({
  providedIn: 'root',
})
export class ActuatorApiService {
  private readonly http = inject(HttpClient)
  private readonly backendService = inject(BackendService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public getActuatorInfo(): Observable<ActuatorData> {
    return this.http.get<ActuatorData>(this.backendService.createUrl(ActuatorPaths.INFO_ENDPOINT), {
      headers: this.backendService.getHeaders(),
    })
  }

  public getActuatorHealth(): Observable<BuildInformationData> {
    return this.http.get<any>(this.backendService.createUrl(ActuatorPaths.HEALTH_ENDPOINT), {
      headers: this.backendService.getHeaders(),
    })
  }
}
