import { Injectable, inject } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { ActuatorData } from 'src/app/model/Interface/ActuatorInfoData/ActuatorData'
import { ActuatorApiService } from '../Backend/Api/ActuatorApi.service'

@Injectable({
  providedIn: 'root',
})
export class ActuatorInformationService {
  private readonly actuator = inject(ActuatorApiService)

  private readonly actuatorInfo$: BehaviorSubject<ActuatorData | null> = new BehaviorSubject<ActuatorData | null>(null)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Fetches and caches actuator information from the backend.
   * @returns {Observable<ActuatorData | null>} of actuator information
   */
  public getActuatorInfo(): Observable<ActuatorData | null> {
    if (this.actuatorInfo$.value) {
      return this.actuatorInfo$.asObservable()
    }
    return this.actuator.getActuatorInfo().pipe(tap((data) => this.actuatorInfo$.next(data)))
  }

  /**
   * Caches the actuator information.
   * @param - The actuator information to cache
   * @returns void
   * @param {ActuatorData} info
   */
  public cacheActuatorInfo(info: ActuatorData): void {
    this.actuatorInfo$.next(info)
  }

  /**
   * Returns the current cached actuator information synchronously.
   * @returns {ActuatorData | null} The current actuator information or null if not yet loaded
   */
  public getActuatorInfoValue(): ActuatorData | null {
    return this.actuatorInfo$.value
  }
}
