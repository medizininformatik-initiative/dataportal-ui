import { ActiveSearchTermService } from 'src/app/service/Search/ActiveSearchTerm.service';
import { CheckboxCellData } from 'src/app/shared/models/TableData/cells/CheckboxCellData';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CriteriaSetSearchService } from 'src/app/service/Search/SearchTypes/CriteriaSet/CriteriaSetSearch.service';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { filter, Observable, Subscription, tap } from 'rxjs';
import { ReferenceCriteriaListEntry } from 'src/app/model/Search/ListEntries/ReferenceCriteriaListEntry';
import { ReferenceCriteriaListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/ReferenceCriteriaListEntryAdapter';
import { ReferenceCriteriaResultList } from 'src/app/model/Search/ResultList/ReferenceCriteriaResultList';
import { SelectedTableItemsService } from 'src/app/service/SearchTermListItemService.service';
import { TableData } from 'src/app/shared/models/TableData/TableData';
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';

interface selectedItem {
  id: string
  display: Display
  system: string
  terminology: string
}
@Component({
  selector: 'num-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss'],
  providers: [SelectedTableItemsService],
})
export class ReferenceComponent implements OnInit, OnDestroy {
  @Input()
  referenceFilterUri: string;

  @Input()
  attributeCode: TerminologyCode;

  listItems: ReferenceCriteriaListEntry[] = [];

  @Output()
  selectedReferenceIds = new EventEmitter<string[]>();

  private subscription: Subscription;

  private loadNextPageSubscription: Subscription;

  adaptedData: TableData;

  isTableItemsSelected = false;

  arrayOfSelectedReferences: selectedItem[] = [];

  searchText$: Observable<string>;

  searchResultsFound = false;

  searchtText: string;

  constructor(
    private activeSearchTermService: ActiveSearchTermService,
    private criteriaSetSearchService: CriteriaSetSearchService,
    private selectedTableItemsService: SelectedTableItemsService<ReferenceCriteriaListEntry>
  ) {}

  ngOnInit() {
    this.startElasticSearch('');
    this.subscription = this.criteriaSetSearchService
      .getSearchResults([this.referenceFilterUri])
      .pipe(
        filter(
          (searchResult: ReferenceCriteriaResultList) => searchResult?.getResults()?.length > 0
        )
      )
      .subscribe((searchTermResults: ReferenceCriteriaResultList) => {
        this.listItems = searchTermResults.getResults();
        this.adaptedData = new ReferenceCriteriaListEntryAdapter().adapt(this.listItems);
        if (this.adaptedData.body.rows.length > 0) {
          this.searchResultsFound = true;
        } else {
          this.searchResultsFound = false;
        }
      });
    this.searchText$ = this.activeSearchTermService.getActiveSearchTerm();
    this.handleSelectedItemsSubscription();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.loadNextPageSubscription?.unsubscribe();
  }

  private handleSelectedItemsSubscription(): void {
    this.selectedTableItemsService
      .getSelectedTableItems()
      .subscribe((selectedItems: ReferenceCriteriaListEntry[]) => {
        if (this.shouldUncheckAll(selectedItems)) {
          this.isTableItemsSelected = false;
          this.uncheckAllRows();
        } else {
          this.isTableItemsSelected = true;
        }
      });
  }

  private shouldUncheckAll(selectedItems: ReferenceCriteriaListEntry[]): boolean {
    return selectedItems.length === 0;
  }

  private uncheckAllRows(): void {
    this.adaptedData?.body.rows.forEach((item) => {
      const checkboxCell = item.cells.find((c): c is CheckboxCellData => c.type === 'checkbox');
      if (checkboxCell) {
        checkboxCell.isSelected = false;
      }
    });
  }

  public startElasticSearch(searchtext: string) {
    if (this.referenceFilterUri?.length > 0) {
      this.searchtText = searchtext;
      this.subscription = this.criteriaSetSearchService
        .search(searchtext, [this.referenceFilterUri])
        .subscribe();
    } else {
      console.warn('No referenceCriteriaUrl was provided');
    }
  }

  setSelectedReferenceCriteria() {
    this.selectedTableItemsService
      .getSelectedTableItems()
      .subscribe((items) => {
        items.forEach((item: ReferenceCriteriaListEntry) => {
          this.arrayOfSelectedReferences.push({
            id: item.getId(),
            display: item.getDisplay(),
            system: item.getSystem(),
            terminology: item.getTerminology(),
          });
        });
      })
      .unsubscribe();

    this.emitIds();
    this.selectedTableItemsService.clearSelection();
  }

  public setSelectedRowItem(item: TableRowData): void {
    const selectedIds = this.selectedTableItemsService.getSelectedIds();
    const itemId = item.originalEntry.getId();
    if (selectedIds.includes(itemId)) {
      this.selectedTableItemsService.removeFromSelection(
        item.originalEntry as ReferenceCriteriaListEntry
      );
    } else {
      this.selectedTableItemsService.setSelectedTableItem(
        item.originalEntry as ReferenceCriteriaListEntry
      );
    }
  }

  public removeSelectedReference(index: number): void {
    this.arrayOfSelectedReferences.splice(index, 1);
    this.emitIds();
  }

  private emitIds(): void {
    this.selectedReferenceIds.emit(this.arrayOfSelectedReferences.map((items) => items.id));
  }

  public loadMoreCriteriaSetResults(): void {
    this.loadNextPageSubscription?.unsubscribe();
    this.loadNextPageSubscription = this.criteriaSetSearchService
      .loadNextPage(this.searchtText, [this.referenceFilterUri])
      .subscribe();
  }
}
