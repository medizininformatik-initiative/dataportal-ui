import { Component, OnInit, inject } from '@angular/core'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { OAuthService } from 'angular-oauth2-oidc'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { ButtonComponent } from 'src/app/shared/components/button/button.component'
import { HeaderComponent } from 'src/app/shared/components/header/header.component'
import { HeaderDescriptionComponent } from 'src/app/shared/components/header-description/header-description.component'

/**
 * @todo Needs to be refactored
 * User directive possibly not needed
 */
@Component({
  selector: 'num-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [TranslateModule, HeaderComponent, HeaderDescriptionComponent, ButtonComponent],
})
export class DashboardComponent implements OnInit {
  private oauthService = inject(OAuthService)
  translate = inject(TranslateService)
  private navigationHelperService = inject(NavigationHelperService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  displayInfoMessage = false
  proposalPortalLink = ''

  ngOnInit(): void {}

  public navigateToDataQueryEditor() {
    this.navigationHelperService.navigateToDataQueryCohortDefinition()
  }

  public navigateToQueryBuilderEditor() {
    this.navigationHelperService.navigateToFeasibilityQueryEditor()
  }

  public navigateToDataSelectionEditor() {
    this.navigationHelperService.navigateToDataSelectionEditor()
  }

  public navigateToSavedQueries() {
    this.navigationHelperService.navigateToSavedQueries()
  }

  public openProposalPortalLink(): void {
    window.open(this.proposalPortalLink, '_blank', 'noopener')
  }

  public navigateToFeasibilityEditor() {
    this.navigationHelperService.navigateToFeasibilityQueryEditor()
  }
}
