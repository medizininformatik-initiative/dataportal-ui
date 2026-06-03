import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { ButtonComponent } from 'src/app/shared/components/button/button.component'
import { Component, inject, OnInit } from '@angular/core'
import { DashboardFaqComponent } from '../dashboard-faq/dashboard-faq.component'
import { HeaderComponent } from 'src/app/shared/components/header/header.component'
import { HeaderDescriptionComponent } from 'src/app/shared/components/header-description/header-description.component'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    HeaderComponent,
    HeaderDescriptionComponent,
    ButtonComponent,
    DashboardFaqComponent,
  ],
})
export class DashboardComponent implements OnInit {
  private appSettingsProviderService = inject(AppSettingsProviderService)
  private navigationHelperService = inject(NavigationHelperService)

  ngOnInit(): void {}

  constructor() {}

  public navigateToProposalPortal(): void {
    const link = this.appSettingsProviderService.getPortalLink()
    window.open(link, '_blank')
  }

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

  public navigateToFeasibilityEditor() {
    this.navigationHelperService.navigateToFeasibilityQueryEditor()
  }
}
