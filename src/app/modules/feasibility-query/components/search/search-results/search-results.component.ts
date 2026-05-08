import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { SearchTermDetails } from 'src/app/model/Search/SearchDetails/SearchTermDetails';
import { TableData } from 'src/app/shared/models/TableData/TableData';
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData';

@Component({
  selector: 'num-criteria-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent {
  @ViewChild('drawer') drawer: MatDrawer;

  @Input() listItems: CriteriaListEntry[] = [];
  @Input() adaptedData: TableData;
  @Input() selectedDetails$: Observable<SearchTermDetails>;
  @Input() searchText$: Observable<string>;
  @Input() searchResultsFound = false;

  @Output() selectedRow = new EventEmitter<TableRowData>();
  @Output() rowClicked = new EventEmitter<TableRowData>();
  @Output() iconClicked = new EventEmitter<TableRowData>();
  @Output() loadMore = new EventEmitter<void>();
  @Output() selectedRelative = new EventEmitter<CriteriaListEntry>();

  public openSidenav(): void {
    this.drawer?.open();
  }

  public closeSidenav(): void {
    this.drawer?.close();
  }
}
