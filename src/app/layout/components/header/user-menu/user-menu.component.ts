import { AboutModalComponent } from '../../about-modal/about-modal.component'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ErrorLogModalComponent } from '../../error-log/error-log-modal.component'
import { ErrorLogProviderService } from 'src/app/service/Validation/ErrorLogProvider.service'
import { IUserProfile } from '../../../../shared/models/user/user-profile.interface'
import { MatDialog } from '@angular/material/dialog'
import { OAuthService } from 'angular-oauth2-oidc'
import { Subscription, tap } from 'rxjs'
import { UserProfileService } from 'src/app/service/User/UserProfile.service'
import { MatFormField } from '@angular/material/form-field'
import { MatSelect } from '@angular/material/select'
import { MatBadge } from '@angular/material/badge'
import { MatOption } from '@angular/material/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-header-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  standalone: true,
  imports: [MatFormField, MatSelect, MatBadge, MatOption, FontAwesomeModule, TranslateModule],
})
export class UserMenuComponent implements OnInit, OnDestroy {
  profile: IUserProfile
  validationResultSubscription$: Subscription

  constructor(
    private oauthService: OAuthService,
    private matDialog: MatDialog,
    private userProfileService: UserProfileService,
    private readonly errorLogProvider: ErrorLogProviderService
  ) {}

  ngOnInit(): void {
    this.initProfile()
  }

  ngOnDestroy(): void {
    this.validationResultSubscription$?.unsubscribe()
  }

  async initProfile(): Promise<void> {
    const isLoggedIn = this.oauthService.hasValidAccessToken()
    if (isLoggedIn) {
      this.profile = this.userProfileService.getCurrentProfile()
    }
  }

  public logout(): void {
    this.oauthService.logOut()
  }

  public getActuatorInfo(): void {
    this.matDialog.open(AboutModalComponent, {})
  }

  public displayErrorLog(): void {
    this.validationResultSubscription$?.unsubscribe()
    this.validationResultSubscription$ = this.errorLogProvider
      .getValidationResult$()
      .pipe(
        tap((report) => {
          if (this.hasErrorsToDisplay()) {
            this.matDialog.open(ErrorLogModalComponent, { data: report })
          }
        })
      )
      .subscribe()
  }

  public hasErrorsToDisplay(): boolean {
    const result = this.errorLogProvider.getCurrentValidationResult()
    return result !== null && result.getIssues().length > 0
  }
}
