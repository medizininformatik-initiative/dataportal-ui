import { CheckboxCellData } from 'src/app/shared/models/TableData/cells/CheckboxCellData';
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry';
import { CriteriaListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CriteriaListEntryAdapter';
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList';
import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter';
import { CriteriaSearchFilterAdapter } from 'src/app/shared/models/SearchFilter/CriteriaSearchFilterAdapter';
import { CriteriaSearchService } from 'src/app/service/Search/SearchTypes/Criteria/CriteriaSearch.service';
import { FilterProvider } from 'src/app/service/Search/Filter/SearchFilterProvider.service';
import { map, Observable, of, Subscription } from 'rxjs';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchFilter } from 'src/app/shared/models/SearchFilter/InterfaceSearchFilter';
import { SearchMode } from 'src/app/shared/components/search-mode-toggle/search-mode-toggle.component';
import { SearchTermDetails } from 'src/app/model/Search/SearchDetails/SearchTermDetails';
import { SearchTermDetailsProviderService } from 'src/app/service/Search/SearchTemDetails/SearchTermDetailsProvider.service';
import { SearchTermDetailsService } from 'src/app/service/Search/SearchTemDetails/SearchTermDetails.service';
import { SelectedTableItemsService } from 'src/app/service/SearchTermListItemService.service';
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service';
import { TableData } from 'src/app/shared/models/TableData/TableData';
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'num-feasibility-query-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class FeasibilityQuerySearchComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('searchResults') searchResultsComponent: SearchResultsComponent;
  listItems: Array<CriteriaListEntry> = [];
  adaptedData: TableData;
  private subscription: Subscription;
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

  handleIconClick(row: TableRowData): void {
    console.log('Icon clicked for row:', row);
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
    this.adaptedData = new CriteriaListEntryAdapter().adapt(this.listItems);
    this.searchResultsFound = this.adaptedData.body.rows.length > 0;
    this.selectedTableItemsService
      .getSelectedTableItems()
      .pipe(
        map((selected) => {
          this.adaptedData.body.rows.forEach((row) => {
            const checkboxCell = row.cells.find((c): c is CheckboxCellData => c.type === 'checkbox');
            if (checkboxCell) {
              checkboxCell.isSelected = selected.some((item) => item.getId() === row.id);
            }
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
      const checkboxCell = item.cells.find((c): c is CheckboxCellData => c.type === 'checkbox');
      if (checkboxCell) {
        checkboxCell.isSelected = false;
      }
    });
  }

  public startSearch(searchText: string = this.searchText): void {
    this.searchText = searchText;
    this.searchWithFilterSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.criteriaSearchService.search(searchText).subscribe();
  }

  public setSelectedRowItem(item: TableRowData): void {
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

  public setClickedRow(row: TableRowData): void {
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

  public openSidenav(): void {
    this.searchResultsComponent?.openSidenav();
  }

  public closeSidenav(): void {
    this.searchResultsComponent?.closeSidenav();
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
