import { Injectable, inject } from '@angular/core'
import { OAuthService } from 'angular-oauth2-oidc'
import { BehaviorSubject, from, Observable, of } from 'rxjs'
import { map, take, tap } from 'rxjs/operators'
import { IUserProfile } from '../../shared/models/user/user-profile.interface'

/**
 * Provides centralized access to user profile loaded by OAuth service.
 */
@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private readonly oauthService = inject(OAuthService)

  /**
   * Current user profile data, null if not loaded or user not authenticated
   */
  private readonly profileSubject = new BehaviorSubject<IUserProfile | null>(null)

  /**
   * Flag to ensure initializeProfile is only executed once
   */
  private isInitialized = false

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Initialize profile loading on service creation
   * This method can only be executed once to prevent duplicate profile loading
   * @returns {Observable<boolean>}
   */
  public initializeProfile(): Observable<boolean> {
    if (this.isInitialized) {
      console.warn('UserProfileService.initializeProfile() already executed, skipping...')
      return of(false)
    }

    this.isInitialized = true

    if (this.isUserAuthenticated()) {
      return from(this.oauthService.loadUserProfile()).pipe(
        take(1),
        tap((profile: IUserProfile) => {
          this.profileSubject.next(profile)
        }),
        map(() => true)
      )
    } else {
      return of(false)
    }
  }

  /**
   * Checks if the user has valid OAuth tokens
   * @returns {boolean}
   */
  private isUserAuthenticated(): boolean {
    return this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken()
  }

  /**
   * Observable stream of user profile data
   * @returns {Observable<IUserProfile | null>}
   */
  public getProfile(): Observable<IUserProfile | null> {
    return this.profileSubject.asObservable()
  }

  /**
   * Current profile data (synchronous access)
   * @returns {IUserProfile | null}
   */
  public getCurrentProfile(): IUserProfile | null {
    return this.profileSubject.value
  }

  /**
   * Clears the cached profile data
   */
  public clearProfile(): void {
    this.profileSubject.next(null)
  }

  /**
   * Checks if the current user has any of the specified roles
   * @param {string[]} roles
   * @returns {boolean}
   */
  public hasRole(roles: string[]): boolean {
    const profile = this.getCurrentProfile()
    if (!profile?.info?.realm_access?.roles) {
      return false
    }

    const userRoles = profile.info.realm_access.roles
    return roles.some((role: string) => userRoles.includes(role))
  }

  /**
   * Gets all user roles
   * @returns {string[]}
   */
  public getUserRoles(): string[] {
    const profile = this.getCurrentProfile()
    return profile?.info?.realm_access?.roles || []
  }

  /**
   * Gets user display name
   * @returns {string}
   */
  public getUserName(): string {
    const profile = this.getCurrentProfile()
    return profile?.info?.name || ''
  }

  /**
   * Checks if user is currently authenticated and has profile loaded
   * @returns {boolean}
   */
  public isAuthenticated(): boolean {
    return this.getCurrentProfile() !== null
  }
}
