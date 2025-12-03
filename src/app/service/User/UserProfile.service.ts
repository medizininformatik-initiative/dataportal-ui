import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { IUserProfile } from '../../shared/models/user/user-profile.interface';
import { map, take, tap } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';

/**
 * Provides centralized access to user profile loaded by OAuth service.
 */
@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  /**
   * Current user profile data, null if not loaded or user not authenticated
   */
  private readonly profileSubject = new BehaviorSubject<IUserProfile | null>(null);

  /**
   * Flag to ensure initializeProfile is only executed once
   */
  private isInitialized = false;

  constructor(private oauthService: OAuthService) {}

  /**
   * Initialize profile loading on service creation
   * This method can only be executed once to prevent duplicate profile loading
   */
  public initializeProfile(): Observable<boolean> {
    if (this.isInitialized) {
      console.warn('UserProfileService.initializeProfile() already executed, skipping...');
      return of(false);
    }

    this.isInitialized = true;

    if (this.isUserAuthenticated()) {
      return from(this.oauthService.loadUserProfile()).pipe(
        take(1),
        tap((profile: IUserProfile) => {
          this.profileSubject.next(profile);
        }),
        map(() => true)
      );
    } else {
      return of(false);
    }
  }

  /**
   * Checks if the user has valid OAuth tokens
   */
  private isUserAuthenticated(): boolean {
    return this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken();
  }

  /**
   * Observable stream of user profile data
   */
  public getProfile(): Observable<IUserProfile | null> {
    return this.profileSubject.asObservable();
  }

  /**
   * Current profile data (synchronous access)
   */
  public getCurrentProfile(): IUserProfile | null {
    return this.profileSubject.value;
  }

  /**
   * Clears the cached profile data
   */
  public clearProfile(): void {
    this.profileSubject.next(null);
  }

  /**
   * Checks if the current user has any of the specified roles
   */
  public hasRole(roles: string[]): boolean {
    const profile = this.getCurrentProfile();
    if (!profile?.info?.realm_access?.roles) {
      return false;
    }

    const userRoles = profile.info.realm_access.roles;
    return roles.some((role) => userRoles.includes(role));
  }

  /**
   * Gets all user roles
   */
  public getUserRoles(): string[] {
    const profile = this.getCurrentProfile();
    return profile?.info?.realm_access?.roles || [];
  }

  /**
   * Gets user display name
   */
  public getUserName(): string {
    const profile = this.getCurrentProfile();
    return profile?.info?.name || '';
  }

  /**
   * Checks if user is currently authenticated and has profile loaded
   */
  public isAuthenticated(): boolean {
    return this.getCurrentProfile() !== null;
  }
}
