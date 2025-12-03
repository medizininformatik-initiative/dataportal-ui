import { Component, OnInit } from '@angular/core';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { TranslateService } from '@ngx-translate/core';

/**
 * @todo Needs to be refactored
 * User directive possibly not needed
 */
@Component({
  selector: 'num-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private oauthService: OAuthService,
    public translate: TranslateService,
    private navigationHelperService: NavigationHelperService
  ) {}

  displayInfoMessage: boolean;
  proposalPortalLink: string;

  ngOnInit(): void {}

  public navigateToDataQueryEditor() {
    this.navigationHelperService.navigateToDataQueryCohortDefinition();
  }

  public navigateToQueryBuilderEditor() {
    this.navigationHelperService.navigateToFeasibilityQueryEditor();
  }

  public navigateToDataSelectionEditor() {
    this.navigationHelperService.navigateToDataSelectionEditor();
  }

  public navigateToSavedQueries() {
    this.navigationHelperService.navigateToSavedQueries();
  }

  public openProposalPortalLink(): void {
    window.open(this.proposalPortalLink, '_blank', 'noopener');
  }

  public navigateToFeasibilityEditor() {
    this.navigationHelperService.navigateToFeasibilityQueryEditor();
  }
}
