import { Component, input, output } from '@angular/core'
import { Observable } from 'rxjs'
import { SearchFilter } from 'src/app/shared/models/SearchFilter/InterfaceSearchFilter'
import { SearchFilterComponent } from '../../../../../shared/components/search-filter/search-filter.component'
import { InfoTooltipDirective } from '../../../../../shared/directives/info-tooltip.directive'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-criteria-search-filter-bar',
  templateUrl: './search-filter-bar.component.html',
  styleUrls: ['./search-filter-bar.component.scss'],
  standalone: true,
  imports: [SearchFilterComponent, InfoTooltipDirective, AsyncPipe, TranslateModule],
})
export class SearchFilterBarComponent {
  readonly searchFilters$ = input<Observable<SearchFilter[]>>(undefined)
  readonly resetFilterEnabled$ = input<Observable<boolean>>(undefined)
  readonly filterChanged = output<SearchFilter>()
  readonly filterReset = output<void>()
  readonly isOpen = output<{
    isOpen: boolean
    targetFilter: string
  }>()

  trackByFilterType(_index: number, filter: SearchFilter): string {
    return filter.filterType
  }
}
