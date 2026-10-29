import { Component, computed, inject, OnDestroy, signal, viewChild } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { map, Subscription } from 'rxjs'
import { CriteriaEntryDetails } from 'src/app/model/Search/EntryDetails/Criteria/CriteriaEntryDetails'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { SelectedTableItemsProvider } from 'src/app/service/Provider/SelectedTableItemsProvider.service'
import { CriteriaEntryDetailsService } from 'src/app/service/Search/ListEntryDetails/CriteriaEntryDetails.service'
import { CriteriaSearchService } from 'src/app/service/Search/SearchTypes/Criteria/CriteriaSearch.service'
import { SnackbarMessageService } from 'src/app/service/SnackbarMessage.service'
import { CriteriaListItemDetailsAdapter } from 'src/app/shared/models/ListItemDetails/Adapter/CriteriaListItemDetailsAdapter'
import { ListItemDetailsData } from 'src/app/shared/models/ListItemDetails/ListItemDetailsData'
import { ListItemDetailsRelativeData } from 'src/app/shared/models/ListItemDetails/ListItemDetailsRelative'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { CriteriaListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CriteriaListEntryAdapter'
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/Cells/Data/CheckboxTextCellData'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { CriteriaListItemDetailsMenuService } from 'src/app/shared/service/Menu/ListItemDetails/Criteria/CriteriaListItemDetailsMenu.service'
import { ListItemDetailsGenericComponent } from '../../../../../shared/components/list-item-details-generic/list-item-details-generic.component'
import { PlaceholderBoxComponent } from '../../../../../shared/components/placeholder-box/placeholder-box.component'
import { TableComponent } from '../../../../../shared/components/table/table.component'
import { TableCellKind } from '../../../../../shared/models/TableData/Cells/TableCellKind'

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
    TableComponent,
    PlaceholderBoxComponent,
    TranslateModule,
  ],
})
export class SearchResultsComponent implements OnDestroy {
  private readonly criteriaSearchService = inject(CriteriaSearchService)
  private readonly selectedTableItemsService = inject<SelectedTableItemsProvider<CriteriaListEntry>>(SelectedTableItemsProvider)
  private readonly criteriaEntryDetailsService = inject(CriteriaEntryDetailsService)
  private readonly snackbarService = inject(SnackbarMessageService)
  private readonly criterionListItemDetailsMenuService = inject(CriteriaListItemDetailsMenuService)
  public readonly drawer = viewChild<MatDrawer>('drawer')

  private readonly searchResultEntries = toSignal(
    this.criteriaSearchService.getSearchResults().pipe(map((r: CriteriaResultList) => r?.getResults() ?? [])),
    {
      initialValue: [] as CriteriaListEntry[],
    }
  )

  private readonly selectedItems = toSignal(this.selectedTableItemsService.getItems(), {
    initialValue: [] as CriteriaListEntry[],
  })

  public readonly searchText = toSignal(this.criteriaSearchService.getActiveSearchTerm(), {
    initialValue: '',
  })

  public menuItems = signal<MenuItemInterface[]>([])

  public readonly adaptedData = computed<TableData>(() => {
    const data = new CriteriaListEntryAdapter().adapt(this.searchResultEntries())
    const selected = this.selectedItems()
    data?.body.rows.forEach((row: TableRowData) => {
      const checkboxCell = row.cells.find((c): c is CheckboxTextCellData => c.type === TableCellKind.CHECKBOXTEXT)
      if (checkboxCell) {
        checkboxCell.isSelected = selected.some((item: CriteriaListEntry) => item.getId() === row.id)
      }
    })
    return data
  })

  public readonly listItems = computed(() => this.searchResultEntries())

  public readonly searchResultsFound = computed(() => (this.adaptedData()?.body.rows.length ?? 0) > 0)

  private listItemDetailsSubscription?: Subscription
  private loadMoreSubscription?: Subscription

  private selectedEntryId: string = ''

  public ngOnDestroy() {
    this.listItemDetailsSubscription?.unsubscribe()
    this.loadMoreSubscription?.unsubscribe()
  }

  public readonly adaptedDetailsData = signal<ListItemDetailsData | undefined>(undefined)

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
      .subscribe((details: CriteriaEntryDetails) => {
        this.adaptedDetailsData.set(new CriteriaListItemDetailsAdapter().adapt(details))
      })
    this.selectedEntryId === entry.getId() ? this.drawer().toggle() : this.drawer().open()
    this.selectedEntryId = entry.getId()
  }

  public getSelectedRelative(item: ListItemDetailsRelativeData): void {
    this.listItemDetailsSubscription?.unsubscribe()
    this.listItemDetailsSubscription = this.criteriaEntryDetailsService.loadDetails(item.id).subscribe((details: CriteriaEntryDetails) => {
      this.adaptedDetailsData.set(new CriteriaListItemDetailsAdapter().adapt(details))
      this.openSidenav()
    })
  }

  public loadMoreCriteriaSearchResults(): void {
    this.loadMoreSubscription?.unsubscribe()
    this.loadMoreSubscription = this.criteriaSearchService.loadNextPage(this.searchText()).subscribe()
  }

  public openSidenav(): void {
    this.drawer()?.open()
  }

  public closeSidenav(): void {
    this.drawer()?.close()
  }
}
