import { ActuatorApiService } from './service/Backend/Api/ActuatorApi.service'
import { ActuatorInformationService } from './service/Actuator/ActuatorInformation.service'
import { AppConfigData } from './config/model/AppConfig/AppConfigData'
import { AppConfigService } from './config/AppConfig.service'
import { catchError, concatMap, map, tap } from 'rxjs/operators'
import { DataportalErrorPayloadType } from './core/model/DataportalErrorPayloadType'
import { DataportalConfigService } from './config/DataportalConfig.service'
import { DataSelectionMainProfileInitializerService } from './service/DataSelectionMainProfileInitializerService'
import { DataSelectionProfile } from './model/DataSelection/Profile/DataSelectionProfile'
import { inject, Injectable } from '@angular/core'
import { NEVER, Observable, of, OperatorFunction, throwError } from 'rxjs'
import { OAuthInitService } from './core/auth/OAuthInit.service'
import { ProvidersInitService } from './service/Provider/ProvidersInit.service'
import { TerminologyApiService } from './service/Backend/Api/TerminologyApi.service'
import { TerminologySystemProvider } from './service/Provider/TerminologySystemProvider.service'
import { UiProfileData } from './model/Interface/UiProfileData'
import { UiProfileProviderService } from './service/Provider/UiProfileProvider.service'
import { UserProfileService } from './service/User/UserProfile.service'
@Injectable({ providedIn: 'root' })
export class CoreInitService {
  private appConfigService = inject(AppConfigService)
  private dataportalConfigService = inject(DataportalConfigService)
  private oauthInitService = inject(OAuthInitService)
  private dataSelectionMainProfileInitializerService = inject(
    DataSelectionMainProfileInitializerService
  )
  private terminologySystemProvider = inject(TerminologySystemProvider)
  private providersInitService = inject(ProvidersInitService)
  private actuatorApiService = inject(ActuatorApiService)
  private userProfileService = inject(UserProfileService)
  private terminologyApiService = inject(TerminologyApiService)
  private uiProfileProviderService = inject(UiProfileProviderService)
  private actuatorInformationService = inject(ActuatorInformationService)

  /**
   * Initializes core services and features.
   * The pipe has more than nine operators, so its inferred type is Observable<unknown>
   * and needs an explicit cast.
   * @returns {Observable<AppConfigData>} An observable of the application configuration data.
   */
  public init(): Observable<AppConfigData> {
    return this.loadAppConfig().pipe(
      concatMap(() => this.initOAuth()),
      // Not logged in: the browser is leaving for the login page, so stop here
      concatMap((loggedIn) => (loggedIn ? this.loadDataportalSettings() : NEVER)),
      concatMap(() => this.initUserProfile()),
      concatMap(() => this.checkBackendHealth()),
      concatMap(() => this.getUiProfilesData()),
      concatMap(() => this.loadActuatorInformation()),
      concatMap(() => this.initTerminologySystems()),
      concatMap(() =>
        this.initPatientProfile().pipe(map((patientProfileResult) => ({ patientProfileResult })))
      ),
      concatMap(({ patientProfileResult }) => this.initializeProviders(patientProfileResult)),
      tap(() => console.log('CoreInitService complete'))
    ) as Observable<AppConfigData>
  }

  /**
   * Logs the original error of an init stage and rethrows it as an Error that names the stage.
   * main.ts shows its message on the startup error page, so it must be readable.
   * @param stage - Name of the init stage, e.g. 'Backend health check'
   * @returns {OperatorFunction<T, T>}
   */
  private failWith<T>(stage: string): OperatorFunction<T, T> {
    return catchError((err: unknown) => {
      console.error(`${stage} failed:`, err)
      return throwError(() => new Error(`${stage} failed: ${describeError(err)}`))
    })
  }

  /**
   * Loads the application configuration.
   * @returns {Observable<AppConfigData>} An observable of the application configuration data.
   */
  private loadAppConfig(): Observable<AppConfigData> {
    return this.appConfigService.loadAppConfig().pipe(
      tap((config) => console.log('AppConfig loaded:', !!config)),
      this.failWith('Loading the app configuration')
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
      this.failWith('Loading the dataportal settings')
    )
  }

  /**
   * Initializes OAuth.
   * @returns {Observable<boolean>}
   */
  private initOAuth(): Observable<boolean> {
    return this.oauthInitService.initOAuth().pipe(
      tap((result) => console.log('OAuth initialized:', result)),
      this.failWith('Login')
    )
  }

  /**
   * Initializes the user profile.
   * @returns {Observable<boolean>}
   */
  private initUserProfile(): Observable<boolean> {
    return this.userProfileService.initializeProfile().pipe(
      tap((result) => console.log('UserProfile initialized:', result)),
      this.failWith('Loading the user profile')
    )
  }

  /**
   * Checks the health of the backend.
   * @returns {Observable<boolean>}
   */
  private checkBackendHealth(): Observable<boolean> {
    return this.actuatorApiService.getActuatorHealth().pipe(
      map((result) => (typeof result === 'boolean' ? result : true)),
      tap(() => console.log('Backend is up')),
      this.failWith('Backend health check')
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
      this.failWith('Loading the UI profiles')
    )
  }

  /**
   * Loads the actuator information. A failure is logged but does not stop the init.
   * @returns {Observable<boolean>}
   */
  private loadActuatorInformation(): Observable<boolean> {
    return this.actuatorInformationService.getActuatorInfo().pipe(
      tap((info) => console.log('Actuator information loaded:', !!info)),
      map(() => true),
      catchError((err) => {
        console.warn('Loading the actuator information failed, continuing without it:', err)
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
      concatMap((result) =>
        result === true
          ? of(result)
          : throwError(() => new Error('the provider reported a failure'))
      ),
      this.failWith('Loading the terminology systems')
    )
  }

  /**
   * Initializes the providers.
   * @param patientProfileResult
   * @returns {Observable<boolean>}
   */
  private initializeProviders(patientProfileResult: DataSelectionProfile): Observable<boolean> {
    return this.providersInitService.initializeProviders(patientProfileResult).pipe(
      tap((result) => console.log('Providers initialized:', result === true)),
      concatMap((result) =>
        result === true
          ? of(result)
          : throwError(() => new Error('the provider reported a failure'))
      ),
      this.failWith('Initializing the providers')
    )
  }

  /**
   * Initializes the patient profile for the feature selection.
   * @returns {Observable<DataSelectionProfile>}
   */
  private initPatientProfile(): Observable<DataSelectionProfile> {
    return this.dataSelectionMainProfileInitializerService.initializePatientProfile().pipe(
      tap((result) => console.log('PatientProfile initialized:', !!result)),
      concatMap((result) =>
        result ? of(result) : throwError(() => new Error('no profile was returned'))
      ),
      this.failWith('Loading the patient profile')
    )
  }
}

/**
 * Readable message for an Error or a DataportalErrorObject from HttpErrorInterceptor.
 * @param err - The caught error
 * @returns {string}
 */
function describeError(err: unknown): string {
  if (err instanceof Error) {
    return err.message
  }
  const payload = (err as { payload?: DataportalErrorPayloadType } | null)?.payload
  const issue = payload?.[0]
  return issue && 'message' in issue ? issue.message : String(err)
}
