import { Component, EventEmitter, Input, Output } from '@angular/core'
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
  @Input() searchFilters$: Observable<SearchFilter[]>
  @Input() resetFilterEnabled$: Observable<boolean>
  @Output() filterChanged = new EventEmitter<SearchFilter>()
  @Output() filterReset = new EventEmitter<void>()
  @Output() isOpen = new EventEmitter<{ isOpen: boolean; targetFilter: string }>()

  trackByFilterType(_index: number, filter: SearchFilter): string {
    return filter.filterType
  }
}
