import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry';
import { CriteriaListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CriteriaListEntryAdapter';
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList';
import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter';
import { CriteriaSearchFilterAdapter } from 'src/app/shared/models/SearchFilter/CriteriaSearchFilterAdapter';
import { CriteriaSearchService } from 'src/app/service/Search/SearchTypes/Criteria/CriteriaSearch.service';
import { FilterProvider } from 'src/app/service/Search/Filter/SearchFilterProvider.service';
import { InterfaceTableDataRow } from 'src/app/shared/models/TableData/InterfaceTableDataRows';
import { map, Observable, of, Subscription } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { SearchFilter } from 'src/app/shared/models/SearchFilter/InterfaceSearchFilter';
import { SearchTermDetails } from 'src/app/model/Search/SearchDetails/SearchTermDetails';
import { SearchTermDetailsProviderService } from 'src/app/service/Search/SearchTemDetails/SearchTermDetailsProvider.service';
import { SearchTermDetailsService } from 'src/app/service/Search/SearchTemDetails/SearchTermDetails.service';
import { SelectedTableItemsService } from 'src/app/service/SearchTermListItemService.service';
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service';
import { TableData } from 'src/app/shared/models/TableData/InterfaceTableData';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { SearchMode } from 'src/app/shared/components/search-mode-toggle/search-mode-toggle.component';

@Component({
  selector: 'num-feasibility-query-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class FeasibilityQuerySearchComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('drawer') sidenav: MatDrawer;
  @ViewChild('outlet', { read: ViewContainerRef }) outletRef: ViewContainerRef;
  @ViewChild('content', { read: TemplateRef }) contentRef: TemplateRef<any>;
  listItems: Array<CriteriaListEntry> = [];
  adaptedData: TableData;
  private subscription: Subscription;
  isOpen = false;

  private isInitialized = false;

  elasticSearchEnabled = false;

  listIetmDetailsSubscription: Subscription;

  selectedDetails$: Observable<SearchTermDetails>;

  searchFilters$: Observable<SearchFilter[]> = of([]);

  searchText$: Observable<string>;

  searchText = '';

  searchResultsFound = false;

  searchSubscription: Subscription;

  searchWithFilterSubscription: Subscription;

  resetFilterEnabled$: Observable<boolean> = of(true);

  searchButtonEnabled$: Observable<boolean> = of(true);

  constructor(
    public elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private searchFilterProvider: FilterProvider,
    private selectedTableItemsService: SelectedTableItemsService<CriteriaListEntry>,
    private searchTermDetailsService: SearchTermDetailsService,
    private searchTermDetailsProviderService: SearchTermDetailsProviderService,
    private criteriaSearchService: CriteriaSearchService,
    private snackbarService: SnackbarService,
    private navigationHelperService: NavigationHelperService
  ) {
    this.subscription = this.criteriaSearchService
      .getSearchResults()
      .subscribe((results) => this.handleSearchResults(results?.getResults() || []));
  }

  ngOnInit() {
    this.selectedDetails$ = this.searchTermDetailsProviderService.getSearchTermDetails$();
    this.searchText$ = this.criteriaSearchService.getActiveSearchTerm();
    this.resetFilterEnabled$ = this.searchFilterProvider.filtersNotSet();
    this.handleSelectedItemsSubscription();
    this.getElasticSearchFilter();
  }

  ngAfterViewInit() {
    this.isInitialized = true;
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.searchWithFilterSubscription?.unsubscribe();
    this.listIetmDetailsSubscription?.unsubscribe();
  }

  public getSelectedRelative(criteriaListEntry: CriteriaListEntry) {
    this.listIetmDetailsSubscription?.unsubscribe();
    this.listIetmDetailsSubscription = this.searchTermDetailsService
      .getDetailsForListItem(criteriaListEntry.getId())
      .subscribe((test) => {
        this.searchTermDetailsProviderService.setSearchTermDetails(test);
        this.openSidenav();
      });
  }

  /** Search Result Handling */
  private handleSearchResults(results: CriteriaListEntry[]): void {
    this.listItems = results;
    this.adaptedData = CriteriaListEntryAdapter.adapt(this.listItems);
    this.searchResultsFound = this.adaptedData.body.rows.length > 0;
    this.selectedTableItemsService
      .getSelectedTableItems()
      .pipe(
        map((selected) => {
          this.adaptedData.body.rows.forEach((row) => {
            row.isCheckboxSelected = selected.some((item) => item.getId() === row.id);
          });
        })
      )
      .subscribe();
  }

  /**
   * If the checked table items get added to stage they will be removed from the SelectedTableItemsService
   * Behaviour Subject Array and therefore an empty Array will be returned. Therefore all checkboxes can be
   * unchecked in the table
   */
  private handleSelectedItemsSubscription(): void {
    this.selectedTableItemsService
      .getSelectedTableItems()
      .subscribe((selectedItems: CriteriaListEntry[]) => {
        if (selectedItems.length === 0) {
          this.uncheckAllRows();
        }
      });
  }

  private uncheckAllRows(): void {
    this.adaptedData?.body.rows.forEach((item) => {
      if (item.isCheckboxSelected) {
        item.isCheckboxSelected = false;
      }
    });
  }

  public startSearch(searchText: string = this.searchText): void {
    this.searchText = searchText;
    this.searchWithFilterSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.criteriaSearchService.search(searchText).subscribe();
  }

  public setSelectedRowItem(item: InterfaceTableDataRow) {
    const selectedIds = this.selectedTableItemsService.getSelectedIds();
    const itemId = item.originalEntry.getId();
    if (selectedIds.includes(itemId)) {
      this.selectedTableItemsService.removeFromSelection(item.originalEntry as CriteriaListEntry);
      this.snackbarService.displayErrorMessageWithNoCode(
        'FEASIBILITY.SEARCH.SNACKBAR.REMOVED_FROM_STAGE'
      );
    } else {
      this.snackbarService.displayInfoMessage('FEASIBILITY.SEARCH.SNACKBAR.ADDED_TO_STAGE');
      this.selectedTableItemsService.setSelectedTableItem(item.originalEntry as CriteriaListEntry);
    }
  }

  public setClickedRow(row: InterfaceTableDataRow) {
    const originalEntry = row.originalEntry as CriteriaListEntry;
    this.listIetmDetailsSubscription?.unsubscribe();
    this.listIetmDetailsSubscription = this.searchTermDetailsService
      .getDetailsForListItem(originalEntry.getId())
      .subscribe((test) => {
        this.searchTermDetailsProviderService.setSearchTermDetails(test);
        this.openSidenav();
      });
  }

  public getElasticSearchFilter(): void {
    this.searchFilters$ = this.searchFilterProvider
      .getCriteriaSearchFilters()
      .pipe(
        map((searchFilters: CriteriaSearchFilter[]) =>
          searchFilters.map((searchFilter: CriteriaSearchFilter) =>
            CriteriaSearchFilterAdapter.convertToFilterValues(searchFilter)
          )
        )
      );
  }

  public setElasticSearchFilter(newFilter: SearchFilter) {
    this.searchWithFilterSubscription?.unsubscribe();
    this.searchFilterProvider.updateFilterSelectedValues(
      newFilter.filterType,
      newFilter.selectedValues
    );
    this.startSearch(this.searchText);
  }

  public resetFilter(): void {
    this.searchFilterProvider.resetSelectedValues();
    this.startSearch(this.searchText);
  }

  openSidenav() {
    if (this.sidenav) {
      this.isOpen = true;
      this.sidenav.open();
    }
  }

  closeSidenav() {
    if (this.sidenav) {
      this.isOpen = false;
      this.sidenav.close();
    }
  }

  public loadMoreCriteriaSearchResults() {
    this.searchWithFilterSubscription?.unsubscribe();
    this.searchWithFilterSubscription = this.criteriaSearchService
      .loadNextPage(this.searchText)
      .subscribe((result: CriteriaResultList) => {
        this.handleSearchResults(result.getResults());
      });
  }

  public searchModeChange(mode: SearchMode): void {
    if (mode === 'bulk-search') {
      this.navigationHelperService.navigateToFeasibilityQueryBulkSearch();
    } else if (mode === 'search') {
      this.navigationHelperService.navigateToFeasibilityQuerySearch();
    }
  }
}
