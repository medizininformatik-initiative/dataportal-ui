import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { Component, DestroyRef, inject, output, signal } from '@angular/core'
import { computed } from '@angular/core'
import { map } from 'rxjs'
import { ProfileSearchFilterAdapter } from 'src/app/shared/models/SearchFilter/ProfileSearchFilterAdapter'
import { ProfileSearchFilterProviderService } from 'src/app/service/Search/Filter/ProfileSearchFilterProvider.service'
import { ProfileSearchService } from 'src/app/service/Search/SearchTypes/Profile/ProfileSearch.service'
import { SearchbarComponent } from 'src/app/shared/components/search/searchbar.component'
import { SearchFilterData } from 'src/app/shared/models/SearchFilter/SearchFilterData'
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
  private readonly destroyRef = inject(DestroyRef)

  readonly searchFilter = signal<SearchFilterData | undefined>(undefined)
  readonly searchText = signal('')
  readonly searchTextChange = output<string>()

  private readonly selectedModules = toSignal(
    this.profileSearchFilterProviderService.getSelectedModules(),
    { initialValue: [] as string[] }
  )
  readonly resetFilterDisabled = computed(() => this.selectedModules().length === 0)

  constructor() {
    this.profileSearchFilterProviderService
      .getAll()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((values) => ProfileSearchFilterAdapter.convertToFilterValues(values))
      )
      .subscribe((filter) => {
        this.searchFilter.update((current) =>
          current ? { ...filter, selectedValues: current.selectedValues } : filter
        )
      })
  }

  public onFilterChange(newFilter: SearchFilterData | undefined): void {
    if (!newFilter) return
    this.searchFilter.update((current) =>
      current ? { ...current, selectedValues: newFilter.selectedValues } : newFilter
    )
    this.profileSearchFilterProviderService.setSelectedModules(newFilter.selectedValues)
    this.profileSearchService.search(this.searchText()).subscribe()
  }

  public resetFilter(): void {
    this.profileSearchFilterProviderService.setSelectedModules([])
    this.searchFilter.update((current) => (current ? { ...current, selectedValues: [] } : current))
    this.profileSearchService.search(this.searchText()).subscribe()
  }

  public onSearchTextChange(text: string): void {
    this.searchText.set(text)
    this.searchTextChange.emit(text)
    this.profileSearchService.search(text).subscribe()
  }
}
