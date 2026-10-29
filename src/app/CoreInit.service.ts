import { Injectable, inject } from '@angular/core'
import { Observable, of, throwError } from 'rxjs'
import { catchError, concatMap, map, tap } from 'rxjs/operators'
import { AppConfigService } from './config/AppConfig.service'
import { DataportalConfigService } from './config/DataportalConfig.service'
import { AppConfigData } from './config/model/AppConfig/AppConfigData'
import { OAuthInitService } from './core/auth/OAuthInit.service'
import { DataSelectionProfile } from './model/DataSelection/Profile/DataSelectionProfile'
import { UiProfileData } from './model/Interface/UiProfileData'
import { ActuatorInformationService } from './service/Actuator/ActuatorInformation.service'
import { ActuatorApiService } from './service/Backend/Api/ActuatorApi.service'
import { TerminologyApiService } from './service/Backend/Api/TerminologyApi.service'
import { DataSelectionMainProfileInitializerService } from './service/DataSelectionMainProfileInitializerService'
import { ProvidersInitService } from './service/Provider/ProvidersInit.service'
import { TerminologySystemProvider } from './service/Provider/TerminologySystemProvider.service'
import { UiProfileProviderService } from './service/Provider/UiProfileProvider.service'
import { UserProfileService } from './service/User/UserProfile.service'
@Injectable({ providedIn: 'root' })
export class CoreInitService {
  private readonly appConfigService = inject(AppConfigService)
  private readonly dataportalConfigService = inject(DataportalConfigService)
  private readonly oauthInitService = inject(OAuthInitService)
  private readonly dataSelectionMainProfileInitializerService = inject(DataSelectionMainProfileInitializerService)
  private readonly terminologySystemProvider = inject(TerminologySystemProvider)
  private readonly providersInitService = inject(ProvidersInitService)
  private readonly actuatorApiService = inject(ActuatorApiService)
  private readonly userProfileService = inject(UserProfileService)
  private readonly terminologyApiService = inject(TerminologyApiService)
  private readonly uiProfileProviderService = inject(UiProfileProviderService)
  private readonly actuatorInformationService = inject(ActuatorInformationService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Initializes the application configuration.
   * @see Once the pipe has more than nine operators the return type will
   * be Observable<unknown> therefore it needs to be casted explicitly
   * to the return desired type
   * Initializes core services and features.
   * @returns {Observable<AppConfigData>} An observable of the application configuration data.
   */
  public init(): Observable<AppConfigData> {
    return this.loadAppConfig().pipe(
      concatMap(() => this.initOAuth()),
      concatMap(() => this.loadDataportalSettings()),
      concatMap(() => this.initUserProfile()),
      concatMap(() => this.checkBackendHealth()),
      concatMap(() => this.getUiProfilesData()),
      concatMap(() => this.loadActuatorInformation()),
      concatMap(() => this.initTerminologySystems()),
      concatMap(() => this.initPatientProfile().pipe(map((patientProfileResult) => ({ patientProfileResult })))),
      concatMap(({ patientProfileResult }) => this.initializeProviders(patientProfileResult)),
      tap(() => console.log('CoreInitService complete')),
      catchError((err) => {
        console.error('CoreInitService failed:', err)
        return throwError(() => err)
      })
    ) as Observable<AppConfigData>
  }

  /**
   * Loads the application configuration.
   * @returns {Observable<AppConfigData>} An observable of the application configuration data.
   */
  private loadAppConfig(): Observable<AppConfigData> {
    return this.appConfigService.loadAppConfig().pipe(
      tap((config) => console.log('AppConfig loaded:', !!config)),
      catchError((err) => {
        console.error('Config load failed:', err)
        return throwError(() => err)
      })
    )
  }

  /**
   * Loads the dataportal settings from the backend.
   * @returns {Observable<void>}
   */
  private loadDataportalSettings(): Observable<void> {
    return this.dataportalConfigService.loadDataportalConfig().pipe(
      tap((config) => console.log('Dataportal settings loaded:', !!config)),
      map(() => undefined),
      catchError((err) => {
        console.error('Dataportal settings load failed:', err)
        return throwError(() => err)
      })
    )
  }

  /**
   * Initializes OAuth.
   * @returns {Observable<boolean>}
   */
  private initOAuth(): Observable<boolean> {
    return this.oauthInitService.initOAuth().pipe(
      tap((result) => console.log('OAuth initialized:', result)),
      catchError((err) => {
        console.error('OAuth init failed:', err)
        return throwError(() => err)
      })
    )
  }

  /**
   * Initializes the user profile.
   * @returns {Observable<boolean>}
   */
  private initUserProfile(): Observable<boolean> {
    return this.userProfileService.initializeProfile().pipe(tap((result) => console.log('UserProfile initialized:', result)))
  }

  /**
   * Checks the health of the backend.
   * @returns {Observable<boolean>}
   */
  private checkBackendHealth(): Observable<boolean> {
    return this.actuatorApiService.getActuatorHealth().pipe(
      map((result) => (typeof result === 'boolean' ? result : true)),
      tap(() => console.log('Backend is up')),
      catchError((err) => {
        console.error('Backend health check failed:', err)
        return throwError(() => new Error('Backend is not reachable'))
      })
    )
  }

  /**
   * Returns the UI Profiles data from the backend and caches them.
   * @returns {Observable<UiProfileData[]>}
   */
  private getUiProfilesData(): Observable<UiProfileData[]> {
    return this.terminologyApiService.getUiProfileData().pipe(
      tap((uiProfileData: UiProfileData[]) => this.uiProfileProviderService.setMany(uiProfileData)),
      tap((data: UiProfileData[]) => console.log('UiProfiles data retrieved:', data.length)),
      catchError((err) => {
        console.error('Failed to retrieve UiProfiles data:', err)
        return throwError(() => err)
      })
    )
  }

  private loadActuatorInformation(): Observable<boolean> {
    return this.actuatorInformationService.getActuatorInfo().pipe(
      tap((info) => console.log('Actuator information loaded:', !!info)),
      map(() => true),
      catchError((err) => {
        console.error('Failed to load Actuator information:', err)
        return of(false)
      })
    )
  }

  /**
   * Initializes the terminology systems.
   * @returns {Observable<boolean>}
   */
  private initTerminologySystems(): Observable<boolean> {
    return this.terminologySystemProvider.initializeTerminologySystems().pipe(
      tap((result) => console.log('TerminologySystems initialized:', result === true)),
      concatMap((result) => (result === true ? of(result) : throwError(() => new Error('TerminologySystems initialization failed')))),
      catchError((err) => {
        console.error('TerminologySystems init failed:', err)
        return throwError(() => err)
      })
    )
  }

  /**
   * Initializes the providers.
   * @param {DataSelectionProfile} patientProfileResult
   * @returns {Observable<boolean>}
   */
  private initializeProviders(patientProfileResult: DataSelectionProfile): Observable<boolean> {
    return this.providersInitService.initializeProviders(patientProfileResult).pipe(
      tap((result) => console.log('Providers initialized:', result === true)),
      concatMap((result) => (result === true ? of(result) : throwError(() => new Error('Providers initialization failed')))),
      catchError((err) => {
        console.error('Providers init failed:', err)
        return throwError(() => err)
      })
    )
  }

  /**
   * Initializes the patient profile for the feature selection.
   * @returns {Observable<DataSelectionProfile>}
   */
  private initPatientProfile(): Observable<DataSelectionProfile> {
    return this.dataSelectionMainProfileInitializerService.initializePatientProfile().pipe(
      tap((result) => console.log('PatientProfile initialized:', !!result)),
      concatMap((result) => (result ? of(result) : throwError(() => new Error('PatientProfile initialization failed')))),
      catchError((err) => {
        console.error('PatientProfile init failed:', err)
        return throwError(() => err)
      })
    )
  }
}
