import { Component, inject, signal } from '@angular/core'
import { CriteriaSearchService } from 'src/app/service/Search/SearchTypes/Criteria/CriteriaSearch.service'
import { FilterProvider } from 'src/app/service/Search/Filter/SearchFilterProvider.service'
import { SearchbarComponent } from '../../../../../shared/components/search/searchbar.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { TranslateModule } from '@ngx-translate/core'
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
  selector: 'num-criteria-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [SearchbarComponent, ButtonComponent, TranslateModule],
})
export class SearchBarComponent {
  private criteriaSearchService = inject(CriteriaSearchService)
  private filterProvider = inject(FilterProvider)

  readonly searchText = toSignal(this.criteriaSearchService.getActiveSearchTerm(), {
    initialValue: '',
  })

  readonly resetFilterEnabled = toSignal(this.filterProvider.filtersNotSet(), {
    initialValue: true,
  })

  readonly localSearchText = signal('')

  public onSearchTextChange(text: string): void {
    this.localSearchText.set(text)
    this.startSearch(text)
  }

  public onSearch(): void {
    this.startSearch(this.localSearchText())
  }

  public startSearch(text: string): void {
    this.criteriaSearchService.search(text).subscribe()
  }

  public resetFilter(): void {
    this.filterProvider.resetSelectedValues()
    this.criteriaSearchService.search(this.localSearchText()).subscribe()
  }
}
