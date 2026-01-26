import { AboutModalComponent } from '../about-modal/about-modal.component';
import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service';
import { Component, OnInit } from '@angular/core';
import { ErrorLog } from 'src/app/model/Validation/ErrorLog';
import { ErrorLogModalComponent } from '../error-log/error-log-modal.component';
import { ErrorLogProviderService } from 'src/app/service/Validation/ErrorLogProvider.service';
import { IUserProfile } from '../../../shared/models/user/user-profile.interface';
import { MatDialog } from '@angular/material/dialog';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { UserProfileService } from 'src/app/service/User/UserProfile.service';

@Component({
  selector: 'num-dataportal-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  profile: IUserProfile;
  stylesheet: string;
  urlSrc: string;
  urlAlt: string;
  proposalPortalLink: string;
  validationResult$: Observable<ErrorLog>;
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
    this.validationResult$ = this.errorLogProvider.getValidationResult$();
    if (this.hasErrorsToDisplay()) {
      this.matDialog.open(ErrorLogModalComponent, {
        data: this.validationResult$,
      });
    }
  }

  public navigateToProposalPortal() {
    this.proposalPortalLink = this.appSettingsProviderService.getPortalLink();
    window.open(this.proposalPortalLink, '_blank');
  }

  public hasErrorsToDisplay(): boolean {
    const result = this.errorLogProvider.getCurrentValidationResult();
    return result !== null && result.getErrorCount() > 0;
  }
}
