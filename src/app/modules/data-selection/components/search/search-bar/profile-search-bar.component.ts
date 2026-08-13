import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { Component, DestroyRef, inject, output, signal } from '@angular/core'
import { computed } from '@angular/core'
import { map } from 'rxjs'
import { ProfileSearchFilterAdapter } from 'src/app/shared/models/SearchFilter/ProfileSearchFilterAdapter'
import { ProfileSearchFilterProviderService } from 'src/app/service/Search/Filter/ProfileSearchFilterProvider.service'
import { ProfileFilterFetchService } from 'src/app/service/Search/Filter/ProfileFilterFetch.service'
import { ProfileSearchService } from 'src/app/service/Search/SearchTypes/Profile/ProfileSearch.service'
import { SearchbarComponent } from 'src/app/shared/components/search/searchbar.component'
import { SearchFilterData } from 'src/app/shared/models/SearchFilter/SearchFilterData'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import {
  InfoTooltipDirective,
  SearchFilterComponent,
  SectionNameComponent,
} from 'src/app/shared/components/shared-components.module'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-profile-search-bar',
  templateUrl: './profile-search-bar.component.html',
  styleUrls: ['./profile-search-bar.component.scss'],
  standalone: true,
  imports: [
    SearchbarComponent,
    SearchFilterComponent,
    ButtonComponent,
    TranslateModule,
    SectionNameComponent,
    InfoTooltipDirective,
  ],
})
export class ProfileSearchBarComponent {
  private profileSearchService = inject(ProfileSearchService)
  private profileSearchFilterProviderService = inject(ProfileSearchFilterProviderService)
  private profileFilterFetchService = inject(ProfileFilterFetchService)
  private readonly destroyRef = inject(DestroyRef)

  readonly searchFilters = signal<SearchFilterData[]>([])
  readonly searchText = toSignal(this.profileSearchService.getActiveSearchTerm(), {
    initialValue: '',
  })
  readonly searchTextChange = output<string>()

  private readonly selectedModules = toSignal(
    this.profileSearchFilterProviderService.getSelectedModules(),
    { initialValue: [] as string[] }
  )
  private readonly selectedCategories = toSignal(
    this.profileSearchFilterProviderService.getSelectedCategories(),
    { initialValue: [] as string[] }
  )
  private readonly selectedResourceTypes = toSignal(
    this.profileSearchFilterProviderService.getSelectedResourceTypes(),
    { initialValue: [] as string[] }
  )
  readonly resetFilterDisabled = computed(
    () =>
      this.selectedModules().length === 0 &&
      this.selectedCategories().length === 0 &&
      this.selectedResourceTypes().length === 0
  )

  constructor() {
    this.profileSearchFilterProviderService
      .getProfileSearchFilters()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((filters) => ProfileSearchFilterAdapter.convertToFilterValues(filters)),
        // TODO: temp exclusion of category filter to be included once categories filled in ontology
        map((filters: SearchFilterData[]) =>
          filters.filter(
            (f) => f.filterType.toLowerCase() !== ElasticSearchFilterTypes.CATEGORY.toLowerCase()
          )
        ),
        map((filters: SearchFilterData[]) => {
          const order: Record<string, number> = {
            [ElasticSearchFilterTypes.MODULE.toLowerCase()]: 0,
            [ElasticSearchFilterTypes.CATEGORY.toLowerCase()]: 1,
            [ElasticSearchFilterTypes.RESOURCE_TYPE.toLowerCase()]: 2,
          }

          return [...filters].sort(
            (a, b) =>
              (order[a.filterType.toLowerCase()] ?? 99) - (order[b.filterType.toLowerCase()] ?? 99)
          )
        })
      )
      .subscribe((filters) => {
        this.searchFilters.set(filters)
      })
  }

  public onFilterChange(newFilter: SearchFilterData | undefined): void {
    if (!newFilter) return

    this.profileFilterFetchService.fetchAndUpdateFilters(this.searchText(), newFilter.filterType)
    this.profileSearchFilterProviderService.updateFilterSelectedValues(
      newFilter.filterType,
      newFilter.selectedValues
    )
    this.profileSearchService.search(this.searchText()).subscribe()
  }

  public onFilterOpen(event: { isOpen: boolean; targetFilter: string }): void {
    if (!event.isOpen) {
      return
    }

    this.profileFilterFetchService.fetchAndUpdateFilters(this.searchText(), event.targetFilter)
  }

  public resetFilter(): void {
    this.profileSearchFilterProviderService.resetSelectedValues()
    this.profileSearchService.search(this.searchText()).subscribe()
  }

  public trackByFilterType(_index: number, filter: SearchFilterData): string {
    return filter.filterType
  }

  public onSearchTextChange(text: string): void {
    this.searchTextChange.emit(text)
    this.profileSearchService.search(text).subscribe()
  }
}
