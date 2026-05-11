import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchFilter } from 'src/app/shared/models/SearchFilter/InterfaceSearchFilter';

@Component({
  selector: 'num-criteria-search-filter-bar',
  templateUrl: './search-filter-bar.component.html',
  styleUrls: ['./search-filter-bar.component.scss'],
})
export class SearchFilterBarComponent {
  @Input() searchFilters$: Observable<SearchFilter[]>;
  @Input() resetFilterEnabled$: Observable<boolean>;
  @Output() filterChanged = new EventEmitter<SearchFilter>();
  @Output() filterReset = new EventEmitter<void>();
  @Output() isOpen = new EventEmitter<{ isOpen: boolean; targetFilter: string }>();

  trackByFilterType(_index: number, filter: SearchFilter): string {
    return filter.filterType;
  }
}
