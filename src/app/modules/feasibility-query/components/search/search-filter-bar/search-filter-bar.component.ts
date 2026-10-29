import { Component, DestroyRef, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'
import { map } from 'rxjs'
import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { CriteriaFilterFetchService } from 'src/app/service/Search/Filter/CriteriaFilterFetch.service'
import { FilterProvider } from 'src/app/service/Search/Filter/SearchFilterProvider.service'
import { CriteriaSearchService } from 'src/app/service/Search/SearchTypes/Criteria/CriteriaSearch.service'
import { SectionNameComponent } from 'src/app/shared/components/section-name/section-name.component'
import { CriteriaSearchFilterAdapter } from 'src/app/shared/models/SearchFilter/CriteriaSearchFilterAdapter'
import { SearchFilterData } from 'src/app/shared/models/SearchFilter/SearchFilterData'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { SearchFilterComponent } from '../../../../../shared/components/search-filter/search-filter.component'
import { InfoTooltipDirective } from '../../../../../shared/directives/info-tooltip.directive'

@Component({
  selector: 'num-criteria-search-filter-bar',
  templateUrl: './search-filter-bar.component.html',
  styleUrls: ['./search-filter-bar.component.scss'],
  standalone: true,
  imports: [SearchFilterComponent, InfoTooltipDirective, TranslateModule, SectionNameComponent, ButtonComponent],
})
export class SearchFilterBarComponent {
  private readonly filterProvider = inject(FilterProvider)
  private readonly criteriaFilterFetchService = inject(CriteriaFilterFetchService)
  private readonly criteriaSearchService = inject(CriteriaSearchService)
  private readonly destroyRef = inject(DestroyRef)

  public readonly searchFilters = toSignal(
    this.filterProvider.getCriteriaSearchFilters().pipe(
      map((filters: CriteriaSearchFilter[]) => filters.map((f) => CriteriaSearchFilterAdapter.convertToFilterValues(f))),
      map((filters: SearchFilterData[]) => {
        const order: Record<string, number> = {
          [ElasticSearchFilterTypes.KDS_MODULE]: 0,
          [ElasticSearchFilterTypes.CONTEXT]: 1,
          [ElasticSearchFilterTypes.TERMINOLOGY]: 2,
        }
        return [...filters].sort((a, b) => (order[a.filterType.toLowerCase()] ?? 99) - (order[b.filterType.toLowerCase()] ?? 99))
      })
    ),
    { initialValue: [] as SearchFilterData[] }
  )

  public readonly canResetFilters = toSignal(this.filterProvider.filtersNotSet(), {
    initialValue: true,
  })

  private readonly searchText = toSignal(this.criteriaSearchService.getActiveSearchTerm(), {
    initialValue: '',
  })
  public readonly resetFilterEnabled = toSignal(this.filterProvider.filtersNotSet(), {
    initialValue: true,
  })
  public readonly localSearchText = signal('')

  public onFilterChange(newFilter: SearchFilterData): void {
    const filterType = newFilter.filterType.toLocaleLowerCase()
    this.criteriaFilterFetchService.fetchAndUpdateFilters(this.searchText(), filterType)
    this.filterProvider.updateFilterSelectedValues(newFilter.filterType as ElasticSearchFilterTypes, newFilter.selectedValues)
    this.criteriaSearchService.search(this.searchText()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe()
  }

  public onResetFilters(): void {
    this.filterProvider.resetSelectedValues()
    this.criteriaSearchService.search(this.searchText()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe()
  }

  public onFilterOpen(event: { isOpen: boolean; targetFilter: string }): void {
    if (!event.isOpen) {
      return
    }
    this.criteriaFilterFetchService.fetchAndUpdateFilters(this.searchText(), event.targetFilter)
  }

  public trackByFilterType(_index: number, filter: SearchFilterData): string {
    return filter.filterType
  }

  public resetFilter(): void {
    this.filterProvider.resetSelectedValues()
    this.criteriaSearchService.search(this.localSearchText()).subscribe()
  }
}
