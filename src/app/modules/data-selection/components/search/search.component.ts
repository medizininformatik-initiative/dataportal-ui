import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { Component, inject, OnInit } from '@angular/core'
import { HeaderComponent } from '../../../../shared/components/header/header.component'
import { HeaderDescriptionComponent } from '../../../../shared/components/header-description/header-description.component'
import { ProfileSearchActionBarComponent } from './action-bar/profile-search-action-bar.component'
import { ProfileSearchBarComponent } from './search-bar/profile-search-bar.component'
import { ProfileSearchResultsComponent } from './search-results/profile-search-results.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-search-data-selection',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    HeaderDescriptionComponent,
    ProfileSearchBarComponent,
    ProfileSearchResultsComponent,
    ProfileSearchActionBarComponent,
    TranslateModule,
  ],
})
export class SearchDataSelectionComponent implements OnInit {
  private appSettingsProviderService = inject(AppSettingsProviderService)

  emailLink = ''

  ngOnInit(): void {
    this.emailLink = this.appSettingsProviderService.getEmail()
  }
}
