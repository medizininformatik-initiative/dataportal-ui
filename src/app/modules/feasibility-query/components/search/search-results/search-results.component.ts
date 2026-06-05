import { CheckboxTextCellData } from 'src/app/shared/models/TableData/cells/CheckboxTextCellData'
import { Component, computed, inject, OnDestroy, viewChild } from '@angular/core'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { CriteriaListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CriteriaListEntryAdapter'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { CriteriaSearchService } from 'src/app/service/Search/SearchTypes/Criteria/CriteriaSearch.service'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { ListItemDetailsComponent } from '../../../../../shared/components/list-item-details/list-item-details.component'
import { map, Observable, Subscription } from 'rxjs'
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav'
import { MatTooltip } from '@angular/material/tooltip'
import { PlaceholderBoxComponent } from '../../../../../shared/components/placeholder-box/placeholder-box.component'
import { SearchTermDetails } from 'src/app/model/Search/SearchDetails/SearchTermDetails'
import { SearchTermDetailsProviderService } from 'src/app/service/Search/SearchTemDetails/SearchTermDetailsProvider.service'
import { SearchTermDetailsService } from 'src/app/service/Search/SearchTemDetails/SearchTermDetails.service'
import { SelectedTableItemsProvider } from 'src/app/service/Provider/SelectedTableItemsProvider.service'
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service'
import { TableComponent } from '../../../../../shared/components/table/table.component'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'
import { SnackbarMessageService } from 'src/app/service/SnackbarMessage.service'

@Component({
  selector: 'num-criteria-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  standalone: true,
  imports: [
    MatDrawerContainer,
    MatDrawer,
    MatTooltip,
    FontAwesomeModule,
    ListItemDetailsComponent,
    MatDrawerContent,
    InfiniteScrollDirective,
    TableComponent,
    PlaceholderBoxComponent,
    TranslateModule,
  ],
})
export class SearchResultsComponent implements OnDestroy {
  private criteriaSearchService = inject(CriteriaSearchService)
  private selectedTableItemsService = inject<SelectedTableItemsProvider<CriteriaListEntry>>(
    SelectedTableItemsProvider
  )
  private searchTermDetailsService = inject(SearchTermDetailsService)
  private searchTermDetailsProviderService = inject(SearchTermDetailsProviderService)
  private snackbarService = inject(SnackbarMessageService)

  readonly drawer = viewChild<MatDrawer>('drawer')

  private searchResultEntries = toSignal(
    this.criteriaSearchService.getSearchResults().pipe(map((r) => r?.getResults() ?? [])),
    { initialValue: [] as CriteriaListEntry[] }
  )

  private selectedItems = toSignal(this.selectedTableItemsService.getItems(), {
    initialValue: [] as CriteriaListEntry[],
  })

  readonly searchText = toSignal(this.criteriaSearchService.getActiveSearchTerm(), {
    initialValue: '',
  })

  readonly adaptedData = computed<TableData>(() => {
    const data = new CriteriaListEntryAdapter().adapt(this.searchResultEntries())
    const selected = this.selectedItems()
    data?.body.rows.forEach((row) => {
      const checkboxCell = row.cells.find(
        (c): c is CheckboxTextCellData => c.type === 'checkboxText'
      )
      if (checkboxCell) {
        checkboxCell.isSelected = selected.some((item) => item.getId() === row.id)
      }
    })
    return data
  })

  readonly listItems = computed(() => this.searchResultEntries())

  readonly searchResultsFound = computed(() => (this.adaptedData()?.body.rows.length ?? 0) > 0)

  readonly selectedDetails$: Observable<SearchTermDetails | null> =
    this.searchTermDetailsProviderService.getSearchTermDetails$()

  private listItemDetailsSubscription!: Subscription
  private loadMoreSubscription!: Subscription

  ngOnDestroy() {
    this.listItemDetailsSubscription?.unsubscribe()
    this.loadMoreSubscription?.unsubscribe()
  }

  public setSelectedRowItem(item: TableRowData): void {
    const selectedIds = this.selectedTableItemsService.getIds()
    const itemId = item.originalEntry.getId()
    if (selectedIds.includes(itemId)) {
      this.selectedTableItemsService.deselect(item.originalEntry as CriteriaListEntry)
      this.snackbarService.displayRemovedFromCriteriaStage()
    } else {
      this.snackbarService.displayAddedToCriteriaStage()
      this.selectedTableItemsService.setActiveItem(item.originalEntry as CriteriaListEntry)
    }
  }

  public setClickedRow(row: TableRowData): void {
    this.listItemDetailsSubscription?.unsubscribe()
    this.listItemDetailsSubscription = this.searchTermDetailsService
      .getDetailsForListItem((row.originalEntry as CriteriaListEntry).getId())
      .subscribe(() => this.openSidenav())
  }

  public getSelectedRelative(criteriaListEntry: CriteriaListEntry): void {
    this.listItemDetailsSubscription?.unsubscribe()
    this.listItemDetailsSubscription = this.searchTermDetailsService
      .getDetailsForListItem(criteriaListEntry.getId())
      .subscribe(() => this.openSidenav())
  }

  public loadMoreCriteriaSearchResults(): void {
    this.loadMoreSubscription?.unsubscribe()
    this.loadMoreSubscription = this.criteriaSearchService
      .loadNextPage(this.searchText())
      .subscribe()
  }

  public openSidenav(): void {
    this.drawer()?.open()
  }

  public closeSidenav(): void {
    this.drawer()?.close()
  }
}
