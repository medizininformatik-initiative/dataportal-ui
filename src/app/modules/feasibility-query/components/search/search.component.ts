import { Component, inject } from '@angular/core'
import { HeaderComponent } from '../../../../shared/components/header/header.component'
import { HeaderDescriptionComponent } from '../../../../shared/components/header-description/header-description.component'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { SearchActionBarComponent } from './action-bar/search/search-action-bar.component'
import { SearchBarComponent } from './search-bar/search-bar.component'
import { SearchFilterBarComponent } from './search-filter-bar/search-filter-bar.component'
import { SearchMode } from 'src/app/shared/components/search-mode-toggle/search-mode-toggle.component'
import { SearchModeToggleComponent } from '../../../../shared/components/search-mode-toggle/search-mode-toggle.component'
import { SearchResultsComponent } from './search-results/search-results.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-feasibility-query-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    SearchModeToggleComponent,
    HeaderDescriptionComponent,
    SearchBarComponent,
    SearchFilterBarComponent,
    SearchResultsComponent,
    SearchActionBarComponent,
    TranslateModule,
  ],
})
export class FeasibilityQuerySearchComponent {
  private navigationHelperService = inject(NavigationHelperService)

  public searchModeChange(mode: SearchMode): void {
    if (mode === 'bulk-search') {
      this.navigationHelperService.navigateToFeasibilityQueryBulkSearch()
    } else if (mode === 'search') {
      this.navigationHelperService.navigateToFeasibilityQuerySearch()
    }
  }
}
