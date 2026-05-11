import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SearchFilter } from '../../models/SearchFilter/InterfaceSearchFilter';

@Component({
  selector: 'num-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
})
export class SearchFilterComponent implements OnInit, OnChanges {
  isOpenData = {
    isOpen: false,
    targetFilter: '',
  };
  @Input()
  filter: SearchFilter;

  @Input()
  multiSelect = true;

  @Output()
  selectedFilterChanged = new EventEmitter<SearchFilter>();

  @Output()
  isOpen = new EventEmitter<{ isOpen: boolean; targetFilter: string }>();

  selectedValues: string[] | string = [];
  searchText = '';

  get filteredData() {
    if (!this.searchText) {
      return this.filter.data;
    }
    const query = this.searchText.toLowerCase();
    return this.filter.data.filter((item) => item.label.toLowerCase().includes(query));
  }

  translatedLabel: { translatedSystem: string; count: number; url: string }[] = [];
  constructor() {}

  ngOnInit(): void {
    this.syncSelectedValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filter) {
      this.syncSelectedValues();
    }
  }

  private syncSelectedValues(): void {
    this.selectedValues = this.multiSelect
      ? this.filter.selectedValues
      : this.filter.selectedValues[0];
  }

  public onSelectionChange(): void {
    const normalizedValues = Array.isArray(this.selectedValues)
      ? this.selectedValues
      : [this.selectedValues];

    this.filter.selectedValues = normalizedValues;
    this.selectedFilterChanged.emit(this.filter);
  }

  public getCleanValue(value: string | string[]): string {
    if (Array.isArray(value)) {
      return value.map((v) => v.replace(/\s*\(\d+\)$/, '')).join(', ');
    }
    return value?.replace(/\s*\(\d+\)$/, '') || '';
  }

  public getTooltipText(): string {
    if (
      !this.selectedValues ||
      (Array.isArray(this.selectedValues) && this.selectedValues?.length === 0)
    ) {
      return 'SHARED_COMPONENTS.FILTER.NO_FILTER_SELECTED';
    }
    return this.getCleanValue(this.selectedValues);
  }

  public onOpenedChange(isOpen: boolean): void {
    if (isOpen) {
      this.isOpenData.isOpen = true;
      this.isOpenData.targetFilter = this.filter.filterType;
      this.isOpen.emit(this.isOpenData);
    }
  }
}
