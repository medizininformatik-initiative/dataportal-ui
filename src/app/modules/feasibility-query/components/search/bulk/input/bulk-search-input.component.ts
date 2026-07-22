import { BulkCriteriaSearchFilterService } from 'src/app/service/Search/Filter/BulkCriteriaSearchFilter.service'
import { BulkCriteriaSearchProvider } from 'src/app/service/Search/SearchTypes/BulkCriteria/BulkCriteriaSearchTextProvider.service'
import { Component, computed, effect, inject, output, signal, untracked } from '@angular/core'
import { FilterProvider } from 'src/app/service/Search/Filter/SearchFilterProvider.service'
import { FormsModule } from '@angular/forms'
import { MatTooltip } from '@angular/material/tooltip'
import { SearchFilterComponent } from '../../../../../../shared/components/search-filter/search-filter.component'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'
import { SearchFilterData } from 'src/app/shared/models/SearchFilter/SearchFilterData'

@Component({
  selector: 'num-bulk-search-input',
  templateUrl: './bulk-search-input.component.html',
  styleUrls: ['./bulk-search-input.component.scss'],
  standalone: true,
  imports: [FormsModule, SearchFilterComponent, MatTooltip, TranslateModule],
})
export class BulkSearchInputComponent {
  private readonly bulkCriteriaSearchProvider = inject(BulkCriteriaSearchProvider)
  private readonly bulkCriteriaSearchFilterService = inject(BulkCriteriaSearchFilterService)
  private readonly searchFilterProvider = inject(FilterProvider)

  readonly searchText = signal(this.bulkCriteriaSearchProvider.getSearchText() ?? '')

  readonly searchFilters = toSignal(this.bulkCriteriaSearchFilterService.getFilter(), {
    initialValue: [] as SearchFilterData[],
  })

  readonly filterMap = signal<Map<string, string[]>>(new Map())

  readonly filterAreSet = computed(() => {
    const map = this.filterMap()
    return map.size > 0 && Array.from(map).every(([, v]) => v.length > 0)
  })

  readonly canSubmit = computed(() => this.filterAreSet() && this.searchText().length > 0)

  readonly searchTextOutput = output<string>()

  constructor() {
    const initEffect = effect(
      () => {
        const filters = this.searchFilters()
        if (filters.length === 0) return

        if (this.filterMap().size === 0) {
          const map = new Map<string, string[]>()
          filters.forEach((f) => map.set(f.filterType, f.selectedValues as string[]))
          this.filterMap.set(map)
        }

        if (this.filterMap().size > 1 && this.searchText().length > 0) {
          untracked(() => this.searchTextOutput.emit(this.searchText()))
        }

        initEffect.destroy()
      },
      { allowSignalWrites: true }
    )
  }

  setElasticSearchFilter(newFilter: SearchFilterData): void {
    const selectedValues = Array.isArray(newFilter.selectedValues)
      ? (newFilter.selectedValues as string[])
      : [newFilter.selectedValues as string]
    this.filterMap.update((map) => {
      const updated = new Map(map)
      updated.set(newFilter.filterType, selectedValues)
      return updated
    })
    this.searchFilterProvider.updateFilterSelectedValues(newFilter.filterType, selectedValues)
  }
}
