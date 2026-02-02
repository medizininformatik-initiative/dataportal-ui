import { ActuatorApiService } from './service/Backend/Api/ActuatorApi.service';
import { AppConfigData } from './config/model/AppConfig/AppConfigData';
import { AppConfigService } from './config/AppConfig.service';
import { catchError, concatMap, map, take, tap, timeout } from 'rxjs/operators';
import { DataportalConfigService } from './config/DataportalConfig.service';
import { DataSelectionMainProfileInitializerService } from './service/DataSelectionMainProfileInitializerService';
import { DataSelectionProfile } from './model/DataSelection/Profile/DataSelectionProfile';
import { Injectable } from '@angular/core';
import { OAuthInitService } from './core/auth/OAuthInit.service';
import { Observable, of, throwError } from 'rxjs';
import { ProvidersInitService } from './service/Provider/ProvidersInit.service';
import { TerminologyApiService } from './service/Backend/Api/TerminologyApi.service';
import { TerminologySystemProvider } from './service/Provider/TerminologySystemProvider.service';
import { UiProfileProviderService } from './service/Provider/UiProfileProvider.service';
import { UiProfileResponseData } from './model/Interface/UiProfileResponseData';
import { UserProfileService } from './service/User/UserProfile.service';
import { ActuatorInformationService } from './service/Actuator/ActuatorInformation.service';
@Injectable({ providedIn: 'root' })
export class CoreInitService {
  constructor(
    private appConfigService: AppConfigService,
    private dataportalConfigService: DataportalConfigService,
    private oauthInitService: OAuthInitService,
    private dataSelectionMainProfileInitializerService: DataSelectionMainProfileInitializerService,
    private terminologySystemProvider: TerminologySystemProvider,
    private providersInitService: ProvidersInitService,
    private actuatorApiService: ActuatorApiService,
    private userProfileService: UserProfileService,
    private terminologyApiService: TerminologyApiService,
    private uiProfileProviderService: UiProfileProviderService,
    private actuatorInformationService: ActuatorInformationService
  ) {}

  /**
   * @see Once the pipe has more than nine operators the return type will
   * be Observable<unknown> therefore it needs to be casted explicitly
   * to the return desired type
   * Initializes core services and features.
   * @returns An observable of the application configuration.
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
      concatMap(() =>
        this.initPatientProfile().pipe(map((patientProfileResult) => ({ patientProfileResult })))
      ),
      concatMap(({ patientProfileResult }) => this.initializeProviders(patientProfileResult)),
      tap(() => console.log('CoreInitService complete')),
      catchError((err) => {
        console.error('CoreInitService failed:', err);
        return throwError(() => err);
      })
    ) as Observable<AppConfigData>;
  }

  /**
   * Loads the application configuration.
   * @returns An observable of the application configuration.
   */
  private loadAppConfig(): Observable<AppConfigData> {
    return this.appConfigService.loadAppConfig().pipe(
      tap((config) => console.log('AppConfig loaded:', !!config)),
      catchError((err) => {
        console.error('Config load failed:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Loads the dataportal settings from the backend.
   * @returns
   */
  private loadDataportalSettings(): Observable<void> {
    return this.dataportalConfigService.loadDataportalConfig().pipe(
      tap((config) => console.log('Dataportal settings loaded:', !!config)),
      map(() => undefined),
      catchError((err) => {
        console.error('Dataportal settings load failed:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Initializes OAuth.
   * @returns
   */
  private initOAuth(): Observable<boolean> {
    return this.oauthInitService.initOAuth().pipe(
      tap((result) => console.log('OAuth initialized:', result)),
      catchError((err) => {
        console.error('OAuth init failed:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Initializes the user profile.
   * @returns
   */
  private initUserProfile(): Observable<boolean> {
    return this.userProfileService
      .initializeProfile()
      .pipe(tap((result) => console.log('UserProfile initialized:', result)));
  }

  /**
   * Checks the health of the backend.
   * @returns
   */
  private checkBackendHealth(): Observable<boolean> {
    return this.actuatorApiService.getActuatorHealth().pipe(
      map((result) => (typeof result === 'boolean' ? result : true)),
      tap(() => console.log('Backend is up')),
      catchError((err) => {
        console.error('Backend health check failed:', err);
        return throwError(() => new Error('Backend is not reachable'));
      })
    );
  }

  /**
   * Returns the UI Profiles data from the backend and caches them.
   * @returns
   */
  private getUiProfilesData(): Observable<UiProfileResponseData[]> {
    return this.terminologyApiService.getUiProfileData().pipe(
      tap((uiProfileResponseData: UiProfileResponseData[]) =>
        this.uiProfileProviderService.cacheUiProfiles(uiProfileResponseData)
      ),
      tap((data: UiProfileResponseData[]) =>
        console.log('UiProfiles data retrieved:', data.length)
      ),
      catchError((err) => {
        console.error('Failed to retrieve UiProfiles data:', err);
        return throwError(() => err);
      })
    );
  }

  private loadActuatorInformation(): Observable<boolean> {
    return this.actuatorInformationService.getActuatorInfo().pipe(
      tap((info) => console.log('Actuator information loaded:', !!info)),
      map(() => true),
      catchError((err) => {
        console.error('Failed to load Actuator information:', err);
        return of(false);
      })
    );
  }

  /**
   * Initializes the terminology systems.
   * @returns
   */
  private initTerminologySystems(): Observable<boolean> {
    return this.terminologySystemProvider.initializeTerminologySystems().pipe(
      tap((result) => console.log('TerminologySystems initialized:', result === true)),
      concatMap((result) =>
        result === true
          ? of(result)
          : throwError(() => new Error('TerminologySystems initialization failed'))
      ),
      catchError((err) => {
        console.error('TerminologySystems init failed:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Initializes the providers.
   * @param patientProfileResult
   * @returns
   */
  private initializeProviders(patientProfileResult: DataSelectionProfile): Observable<boolean> {
    return this.providersInitService.initializeProviders(patientProfileResult).pipe(
      tap((result) => console.log('Providers initialized:', result === true)),
      concatMap((result) =>
        result === true
          ? of(result)
          : throwError(() => new Error('Providers initialization failed'))
      ),
      catchError((err) => {
        console.error('Providers init failed:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Initializes the patient profile for the feature selection.
   * @returns
   */
  private initPatientProfile(): Observable<DataSelectionProfile> {
    return this.dataSelectionMainProfileInitializerService.initializePatientProfile().pipe(
      tap((result) => console.log('PatientProfile initialized:', !!result)),
      concatMap((result) =>
        !!result ? of(result) : throwError(() => new Error('PatientProfile initialization failed'))
      ),
      catchError((err) => {
        console.error('PatientProfile init failed:', err);
        return throwError(() => err);
      })
    );
  }
}
