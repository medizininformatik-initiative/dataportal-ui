import { BulkCriteriaSearchProvider } from 'src/app/service/Search/SearchTypes/BulkCriteria/BulkCriteriaSearchTextProvider.service'
import { BulkCriteriaService } from 'src/app/service/Search/SearchTypes/BulkCriteria/BulkCriteria.service'
import { Component, DestroyRef, inject, signal } from '@angular/core'
import { CriteriaBulkResultList } from 'src/app/model/Search/ResultList/CriteriaBulkResultList'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { SearchMode } from 'src/app/shared/components/search-mode-toggle/search-mode-toggle.component'
import { SelectedBulkCriteriaProvider } from 'src/app/service/SelectedBulkCriteria.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { BulkSearchActionBarComponent } from '../action-bar/bulk-search/bulk-search-action-bar.component'
import { BulkSearchInputComponent } from './input/bulk-search-input.component'
import { BulkSearchResultsComponent, SelectedTab } from './results/bulk-search-results.component'
import { HeaderComponent } from '../../../../../shared/components/header/header.component'
import { HeaderDescriptionComponent } from '../../../../../shared/components/header-description/header-description.component'
import { SearchModeToggleComponent } from '../../../../../shared/components/search-mode-toggle/search-mode-toggle.component'
import { TranslateModule } from '@ngx-translate/core'

export type { SelectedTab }

@Component({
  selector: 'num-feasibility-query-bulk-search',
  templateUrl: './bulk-search.component.html',
  styleUrls: ['./bulk-search.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    SearchModeToggleComponent,
    HeaderDescriptionComponent,
    BulkSearchInputComponent,
    BulkSearchResultsComponent,
    BulkSearchActionBarComponent,
    TranslateModule,
  ],
})
export class FeasibilityQueryBulkSearchComponent {
  private readonly destroyRef = inject(DestroyRef)
  private readonly bulkCriteriaSearchProvider = inject(BulkCriteriaSearchProvider)
  private readonly bulkCriteriaService = inject(BulkCriteriaService)
  private readonly selectedBulkCriteriaService = inject(SelectedBulkCriteriaProvider)
  private readonly navigationHelperService = inject(NavigationHelperService)

  readonly rawResult = signal<CriteriaBulkResultList | null>(null)
  readonly searchtype = signal<SelectedTab>('FOUND')

  submitSearch(text: string): void {
    this.selectedBulkCriteriaService.clear()
    this.bulkCriteriaSearchProvider.setSearchText(text)
    this.bulkCriteriaService
      .search(text)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: CriteriaBulkResultList) => {
        this.selectedBulkCriteriaService.addSelected(response.getFound())
        this.selectedBulkCriteriaService.setUiProfileId(response.getUiProfileId())
        this.rawResult.set(response)
      })
  }

  searchModeChange(mode: SearchMode): void {
    if (mode === 'bulk-search') {
      this.navigationHelperService.navigateToFeasibilityQueryBulkSearch()
    } else {
      this.navigationHelperService.navigateToFeasibilityQuerySearch()
    }
  }
}
