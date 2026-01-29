import { AboutModalComponent } from '../about-modal/about-modal.component';
import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorLogModalComponent } from '../error-log/error-log-modal.component';
import { ErrorLogProviderService } from 'src/app/service/Validation/ErrorLogProvider.service';
import { IUserProfile } from '../../../shared/models/user/user-profile.interface';
import { MatDialog } from '@angular/material/dialog';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable, Subscription, tap } from 'rxjs';
import { UserProfileService } from 'src/app/service/User/UserProfile.service';
import { ValidationReport } from 'src/app/model/Validation/ValidationReport';

@Component({
  selector: 'num-dataportal-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  profile: IUserProfile;
  stylesheet: string;
  urlSrc: string;
  urlAlt: string;
  proposalPortalLink: string;
  validationResultSubscription$: Subscription;
  imagePath = 'assets/img/FDPG-Logo.svg';
  errorCount = 0;

  constructor(
    private oauthService: OAuthService,
    public appSettingsProviderService: AppSettingsProviderService,
    private matDialog: MatDialog,
    private userProfileService: UserProfileService,
    private readonly errorLogProvider: ErrorLogProviderService
  ) {}

  ngOnInit(): void {
    this.initProfile();
  }

  ngOnDestroy(): void {
    this.validationResultSubscription$?.unsubscribe();
  }

  async initProfile(): Promise<void> {
    const isLoggedIn = this.oauthService.hasValidAccessToken();
    if (isLoggedIn) {
      this.profile = this.userProfileService.getCurrentProfile();
    }
  }

  public logout() {
    this.oauthService.logOut();
  }

  public getActuatorInfo() {
    this.matDialog.open(AboutModalComponent, {});
  }

  public displayErrorLog() {
    this.validationResultSubscription$?.unsubscribe();
    this.validationResultSubscription$ = this.errorLogProvider
      .getValidationResult$()
      .pipe(
        tap((report) => {
          if (this.hasErrorsToDisplay()) {
            this.matDialog.open(ErrorLogModalComponent, {
              data: report,
            });
          }
        })
      )
      .subscribe();
  }

  public navigateToProposalPortal() {
    this.proposalPortalLink = this.appSettingsProviderService.getPortalLink();
    window.open(this.proposalPortalLink, '_blank');
  }

  public hasErrorsToDisplay(): boolean {
    const result = this.errorLogProvider.getCurrentValidationResult();
    return result !== null && result.getIssues().length > 0;
  }
}
