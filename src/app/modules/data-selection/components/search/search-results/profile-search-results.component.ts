import { Component, computed, inject, input, signal, viewChild } from '@angular/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/cells/CheckboxTextCellData'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { ListItemDetailsData } from 'src/app/shared/models/ListItemDetails/ListItemDetailsData'
import { ListItemDetailsGenericComponent } from 'src/app/shared/components/list-item-details-generic/list-item-details-generic.component'
import { map } from 'rxjs'
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav'
import { MatTooltip } from '@angular/material/tooltip'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { ProfileEntryAdapter } from 'src/app/shared/models/TableData/Adapter/ProfileEntryAdapter'
import { ProfileEntryDetailsService } from 'src/app/service/Search/ListEntryDetails/ProfileEntryDetails.service'
import { ProfileListEntry } from 'src/app/model/Search/ListEntries/ProfileListEntry'
import { ProfileListItemDetailsMenuService } from 'src/app/shared/service/Menu/ListItemDetails/Profile/ProfileListItemDetailsMenu.service'
import { ProfileListItemDetailsAdapter } from 'src/app/shared/models/ListItemDetails/Adapter/ProfileListItemDetailsAdapter'
import { ProfileSearchService } from 'src/app/service/Search/SearchTypes/Profile/ProfileSearch.service'
import { SelectedProfileService } from 'src/app/service/DataSelection/Selection/SelectedProfileEntry.service'
import { TableComponent } from 'src/app/shared/components/table/table.component'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'
import { TableCellDataTypes } from '../../../../../shared/models/TableData/cells/TableCellType'

@Component({
  selector: 'num-profile-search-results',
  templateUrl: './profile-search-results.component.html',
  styleUrls: ['./profile-search-results.component.scss'],
  standalone: true,
  imports: [
    MatDrawerContainer,
    MatDrawer,
    MatDrawerContent,
    InfiniteScrollDirective,
    TableComponent,
    ListItemDetailsGenericComponent,
    FontAwesomeModule,
    MatTooltip,
    TranslateModule,
  ],
})
export class ProfileSearchResultsComponent {
  private profileSearchService = inject(ProfileSearchService)
  private profileEntryDetailsService = inject(ProfileEntryDetailsService)
  private selectedProfileService = inject(SelectedProfileService)
  private profileListItemDetailsMenuService = inject(ProfileListItemDetailsMenuService)

  readonly drawer = viewChild<MatDrawer>('drawer')

  private selectedEntryId: string = ''

  private readonly activeSearchTerm = toSignal(this.profileSearchService.getActiveSearchTerm(), {
    initialValue: '',
  })

  private readonly searchResultEntries = toSignal(
    this.profileSearchService.getSearchResults().pipe(map((r) => r?.getResults() ?? [])),
    { initialValue: [] as ProfileListEntry[] }
  )

  private readonly selectedProfiles = this.selectedProfileService.getSelectedProfiles()

  readonly adaptedData = computed<TableData>(() => {
    const data = new ProfileEntryAdapter().adapt(this.searchResultEntries())
    const selected = this.selectedProfiles()
    data?.body.rows.forEach((row) => {
      const checkboxCell = row.cells.find(
        (c): c is CheckboxTextCellData => c.type === TableCellDataTypes.CHECKBOXTEXT
      )
      if (checkboxCell) {
        checkboxCell.isSelected = selected.some(
          (p) => p.getUrl() === (row.originalEntry as ProfileListEntry).getUrl()
        )
      }
    })
    return data
  })

  readonly adaptedDetailsData = signal<ListItemDetailsData | undefined>(undefined)

  public getMenuItemsForListItem(data: ListItemDetailsData): MenuItemInterface[] {
    return this.profileListItemDetailsMenuService.getMenuItems(data.selectable)
  }

  public onRowSelected(row: TableRowData): void {
    const entry = row.originalEntry as ProfileListEntry
    if (this.isProfileSelected(entry.getUrl())) {
      this.selectedProfileService.removeFromSelection(entry)
    } else {
      this.selectedProfileService.addToSelection(entry)
    }
  }

  private isProfileSelected(entryUrl: string): boolean {
    return this.selectedProfileService
      .getSelectedProfiles()()
      .some((profile) => profile.getUrl() === entryUrl)
  }

  public loadEntry(row: TableRowData): void {
    const entry = row.originalEntry as ProfileListEntry
    this.profileEntryDetailsService.loadDetails(entry.getId()).subscribe((details) => {
      this.adaptedDetailsData.set(new ProfileListItemDetailsAdapter().adapt(details))
    })
    this.selectedEntryId === entry.getId() ? this.drawer().toggle() : this.drawer().open()
    this.selectedEntryId = entry.getId()
  }

  public loadMoreSearchResults(): void {
    this.profileSearchService.loadNextPage(this.activeSearchTerm()).subscribe()
  }
}
