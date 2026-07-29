import { CheckboxTextCellData } from 'src/app/shared/models/TableData/Cells/Data/CheckboxTextCellData'
import { Component, computed, inject, OnDestroy, signal, viewChild } from '@angular/core'
import { CriteriaEntryDetails } from 'src/app/model/Search/EntryDetails/Criteria/CriteriaEntryDetails'
import { CriteriaEntryDetailsService } from 'src/app/service/Search/ListEntryDetails/CriteriaEntryDetails.service'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { CriteriaListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CriteriaListEntryAdapter'
import { CriteriaListItemDetailsAdapter } from 'src/app/shared/models/ListItemDetails/Adapter/CriteriaListItemDetailsAdapter'
import { CriteriaSearchService } from 'src/app/service/Search/SearchTypes/Criteria/CriteriaSearch.service'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { ListItemDetailsData } from 'src/app/shared/models/ListItemDetails/ListItemDetailsData'
import { ListItemDetailsGenericComponent } from '../../../../../shared/components/list-item-details-generic/list-item-details-generic.component'
import { ListItemDetailsRelativeData } from 'src/app/shared/models/ListItemDetails/ListItemDetailsRelative'
import { map, Subscription } from 'rxjs'
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav'
import { MatTooltip } from '@angular/material/tooltip'
import { PlaceholderBoxComponent } from '../../../../../shared/components/placeholder-box/placeholder-box.component'
import { SelectedTableItemsProvider } from 'src/app/service/Provider/SelectedTableItemsProvider.service'
import { SnackbarMessageService } from 'src/app/service/SnackbarMessage.service'
import { TableComponent } from '../../../../../shared/components/table/table.component'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'
import { TableCellKind } from '../../../../../shared/models/TableData/Cells/TableCellKind'
import { CriteriaListItemDetailsMenuService } from 'src/app/shared/service/Menu/ListItemDetails/Criteria/CriteriaListItemDetailsMenu.service'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'

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
    ListItemDetailsGenericComponent,
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
  private criteriaEntryDetailsService = inject(CriteriaEntryDetailsService)
  private snackbarService = inject(SnackbarMessageService)
  private criterionListItemDetailsMenuService = inject(CriteriaListItemDetailsMenuService)
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

  menuItems = signal<MenuItemInterface[]>([])

  readonly adaptedData = computed<TableData>(() => {
    const data = new CriteriaListEntryAdapter().adapt(this.searchResultEntries())
    const selected = this.selectedItems()
    data?.body.rows.forEach((row) => {
      const checkboxCell = row.cells.find(
        (c): c is CheckboxTextCellData => c.type === TableCellKind.CHECKBOXTEXT
      )
      if (checkboxCell) {
        checkboxCell.isSelected = selected.some((item) => item.getId() === row.id)
      }
    })
    return data
  })

  readonly listItems = computed(() => this.searchResultEntries())

  readonly searchResultsFound = computed(() => (this.adaptedData()?.body.rows.length ?? 0) > 0)

  private listItemDetailsSubscription?: Subscription
  private loadMoreSubscription?: Subscription

  private selectedEntryId: string = ''

  ngOnDestroy() {
    this.listItemDetailsSubscription?.unsubscribe()
    this.loadMoreSubscription?.unsubscribe()
  }

  readonly adaptedDetailsData = signal<ListItemDetailsData | undefined>(undefined)

  public getMenuItemsForListItem(listItemDetailsData: ListItemDetailsData) {
    return this.criterionListItemDetailsMenuService.getMenuItems(listItemDetailsData.selectable)
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
    const entry = row.originalEntry as CriteriaListEntry
    this.listItemDetailsSubscription = this.criteriaEntryDetailsService
      .loadDetails(entry.getId())
      .subscribe((details) => {
        this.adaptedDetailsData.set(new CriteriaListItemDetailsAdapter().adapt(details))
      })
    this.selectedEntryId === entry.getId() ? this.drawer().toggle() : this.drawer().open()
    this.selectedEntryId = entry.getId()
  }

  public getSelectedRelative(item: ListItemDetailsRelativeData): void {
    this.listItemDetailsSubscription?.unsubscribe()
    this.listItemDetailsSubscription = this.criteriaEntryDetailsService
      .loadDetails(item.id)
      .subscribe((details) => {
        this.adaptedDetailsData.set(new CriteriaListItemDetailsAdapter().adapt(details))
        this.openSidenav()
      })
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
