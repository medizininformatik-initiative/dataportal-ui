import { Component, computed, inject, input } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { FilterChipsComponent } from 'src/app/shared/components/filter-chips/filter-chips.component'
import { InfoTooltipDirective } from 'src/app/shared/directives/info-tooltip.directive'
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData'
import { DataSelectionFiltersFilterChips } from 'src/app/shared/service/FilterChips/DataSelection/DataSelectionFiltersFilterChips.service'

@Component({
  selector: 'num-filters-col',
  templateUrl: './filters-col.component.html',
  styleUrls: ['./filters-col.component.scss'],
  standalone: true,
  imports: [FilterChipsComponent, InfoTooltipDirective, TranslateModule],
})
export class FiltersColComponent {
  private readonly filtersFilterChipsService = inject(DataSelectionFiltersFilterChips)

  public readonly profile = input<DataSelectionProfile>()

  public readonly filterChips = computed<FilterChipData[]>(() => {
    const filters = this.profile()?.getFilters() ?? []
    return filters.length > 0 ? this.filtersFilterChipsService.generateFilterChipsForDataSelectionFilters(filters) : []
  })

  public readonly hasChips = computed(() => this.filterChips().length > 0)
}
