import { Component, inject, OnInit } from '@angular/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { ButtonComponent } from 'src/app/shared/components/button/button.component'
import { HeaderComponent } from 'src/app/shared/components/header/header.component'
import { HeaderDescriptionComponent } from 'src/app/shared/components/header-description/header-description.component'
import { UploadService } from '../../../../service/Upload/Upload.service'
import { DashboardFaqComponent } from '../dashboard-faq/dashboard-faq.component'

@Component({
  selector: 'num-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [TranslateModule, HeaderComponent, HeaderDescriptionComponent, ButtonComponent, DashboardFaqComponent, FontAwesomeModule],
})
export class DashboardComponent implements OnInit {
  private readonly appSettingsProviderService = inject(AppSettingsProviderService)
  private readonly navigationHelperService = inject(NavigationHelperService)

  private readonly uploadService = inject(UploadService)
  public uploadDisabled: boolean = false

  public ngOnInit(): void {}

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

  public upload(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files[0]
    this.uploadService.uploadCRTDL(file)
  }
}
