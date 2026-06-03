import { Component, computed, inject } from '@angular/core'
import { CriteriaFilterFetchService } from 'src/app/service/Search/Filter/CriteriaFilterFetch.service'
import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter'
import { CriteriaSearchFilterAdapter } from 'src/app/shared/models/SearchFilter/CriteriaSearchFilterAdapter'
import { CriteriaSearchService } from 'src/app/service/Search/SearchTypes/Criteria/CriteriaSearch.service'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { FilterProvider } from 'src/app/service/Search/Filter/SearchFilterProvider.service'
import { InfoTooltipDirective } from '../../../../../shared/directives/info-tooltip.directive'
import { map } from 'rxjs'
import { SearchFilter } from 'src/app/shared/models/SearchFilter/InterfaceSearchFilter'
import { SearchFilterComponent } from '../../../../../shared/components/search-filter/search-filter.component'
import { SectionNameComponent } from 'src/app/shared/components/section-name/section-name.component'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-criteria-search-filter-bar',
  templateUrl: './search-filter-bar.component.html',
  styleUrls: ['./search-filter-bar.component.scss'],
  standalone: true,
  imports: [SearchFilterComponent, InfoTooltipDirective, TranslateModule, SectionNameComponent],
})
export class SearchFilterBarComponent {
  private filterProvider = inject(FilterProvider)
  private criteriaFilterFetchService = inject(CriteriaFilterFetchService)
  private criteriaSearchService = inject(CriteriaSearchService)

  private rawFilters = toSignal(
    this.filterProvider.getCriteriaSearchFilters().pipe(
      map((filters: CriteriaSearchFilter[]) =>
        filters.map((f) => CriteriaSearchFilterAdapter.convertToFilterValues(f))
      ),
      map((filters: SearchFilter[]) => {
        const order: Record<string, number> = {
          [ElasticSearchFilterTypes.KDS_MODULE]: 0,
          [ElasticSearchFilterTypes.CONTEXT]: 1,
          [ElasticSearchFilterTypes.TERMINOLOGY]: 2,
        }
        return [...filters].sort(
          (a, b) =>
            (order[a.filterType.toLowerCase()] ?? 99) - (order[b.filterType.toLowerCase()] ?? 99)
        )
      })
    ),
    { initialValue: [] as SearchFilter[] }
  )

  readonly resetFilterEnabled = toSignal(this.filterProvider.filtersNotSet(), {
    initialValue: true,
  })

  readonly searchFilters = computed(() => this.rawFilters())

  private readonly activeSearchText = toSignal(this.criteriaSearchService.getActiveSearchTerm(), {
    initialValue: '',
  })

  public setElasticSearchFilter(newFilter: SearchFilter): void {
    const filterType = newFilter.filterType.toLocaleLowerCase()
    this.criteriaFilterFetchService.fetchAndUpdateFilters(this.activeSearchText(), filterType)
    this.filterProvider.updateFilterSelectedValues(
      newFilter.filterType as ElasticSearchFilterTypes,
      newFilter.selectedValues
    )
    this.criteriaSearchService.search(this.activeSearchText()).subscribe()
  }

  public resetFilter(): void {
    this.filterProvider.resetSelectedValues()
    this.criteriaSearchService.search(this.activeSearchText()).subscribe()
  }

  public isFilterOpen(event: { isOpen: boolean; targetFilter: string }): void {
    if (!event.isOpen) {
      return
    }
    this.criteriaFilterFetchService.fetchAndUpdateFilters(
      this.activeSearchText(),
      event.targetFilter
    )
  }

  trackByFilterType(_index: number, filter: SearchFilter): string {
    return filter.filterType
  }
}
