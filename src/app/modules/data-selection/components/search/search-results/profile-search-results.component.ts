import { Component, computed, inject, input, output, signal, viewChild } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { map, tap } from 'rxjs'
import { ProfileListEntry } from 'src/app/model/Search/ListEntries/ProfileListEntry'
import { SelectedProfileService } from 'src/app/service/DataSelection/Selection/SelectedProfileEntry.service'
import { ProfileEntryDetailsService } from 'src/app/service/Search/ListEntryDetails/ProfileEntryDetails.service'
import { ProfileSearchService } from 'src/app/service/Search/SearchTypes/Profile/ProfileSearch.service'
import { ListItemDetailsGenericComponent } from 'src/app/shared/components/list-item-details-generic/list-item-details-generic.component'
import { TableComponent } from 'src/app/shared/components/table/table.component'
import { ProfileListItemDetailsAdapter } from 'src/app/shared/models/ListItemDetails/Adapter/ProfileListItemDetailsAdapter'
import { ListItemDetailsData } from 'src/app/shared/models/ListItemDetails/ListItemDetailsData'
import { ListItemDetailsRelativeData } from 'src/app/shared/models/ListItemDetails/ListItemDetailsRelative'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { ProfileEntryAdapter } from 'src/app/shared/models/TableData/Adapter/ProfileEntryAdapter'
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/Cells/Data/CheckboxTextCellData'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { ProfileListItemDetailsMenuService } from 'src/app/shared/service/Menu/ListItemDetails/Profile/ProfileListItemDetailsMenu.service'
import { ProfileSearchEngineService } from '../../../../../service/Search/SearchTypes/Profile/Engine/ProfileSearchEngine.service'
import { TableCellKind } from '../../../../../shared/models/TableData/Cells/TableCellKind'

@Component({
  selector: 'num-profile-search-results',
  templateUrl: './profile-search-results.component.html',
  styleUrls: ['./profile-search-results.component.scss'],
  standalone: true,
  imports: [
    MatDrawerContainer,
    MatDrawer,
    MatDrawerContent,
    TableComponent,
    ListItemDetailsGenericComponent,
    FontAwesomeModule,
    MatTooltip,
    TranslateModule,
  ],
})
export class ProfileSearchResultsComponent {
  private readonly profileSearchEngineService = inject(ProfileSearchEngineService)
  private readonly profileSearchService = inject(ProfileSearchService)
  private readonly profileEntryDetailsService = inject(ProfileEntryDetailsService)
  private readonly selectedProfileService = inject(SelectedProfileService)
  private readonly profileListItemDetailsMenuService = inject(ProfileListItemDetailsMenuService)
  public readonly drawer = viewChild<MatDrawer>('drawer')

  private selectedEntryId: string = ''

  private readonly activeSearchTerm = toSignal(this.profileSearchService.getActiveSearchTerm(), {
    initialValue: '',
  })

  private readonly searchResultEntries = toSignal(this.profileSearchService.getSearchResults().pipe(map((r) => r?.getResults() ?? [])), {
    initialValue: [] as ProfileListEntry[],
  })

  private readonly selectedProfiles = this.selectedProfileService.getSelectedProfiles()

  public readonly adaptedData = computed<TableData>(() => {
    const data = new ProfileEntryAdapter().adapt(this.searchResultEntries())
    const selected = this.selectedProfiles()
    data?.body.rows.forEach((row) => {
      const checkboxCell = row.cells.find((c): c is CheckboxTextCellData => c.type === TableCellKind.CHECKBOXTEXT)
      if (checkboxCell) {
        checkboxCell.isSelected = selected.some((p) => p.getUrl() === (row.originalEntry as ProfileListEntry).getUrl())
      }
    })
    return data
  })

  public readonly adaptedDetailsData = signal<ListItemDetailsData | undefined>(undefined)

  public triggerSelectAll = { id: Date.now(), value: false }

  public getMenuItemsForListItem(data: ListItemDetailsData): MenuItemInterface[] {
    return this.profileListItemDetailsMenuService.getMenuItems(data.selectable)
  }

  public onRowSelected(row: TableRowData): void {
    const entry = row.originalEntry as ProfileListEntry
    if (this.isProfileSelected(entry.getUrl())) {
      this.selectedProfileService.removeFromSelection(entry)
      this.triggerSelectAll = { id: Date.now(), value: false }
    } else {
      this.selectedProfileService.addToSelection(entry)
      if (this.selectedProfiles().length === this.searchResultEntries().length) {
        this.triggerSelectAll = { id: Date.now(), value: true }
      }
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

  public onSelectedRelative(item: ListItemDetailsRelativeData) {
    const originalDisplay = item.display.getOriginal()
    this.profileSearchService.search(originalDisplay).subscribe()
  }
  public selectAll(areAllSelected: boolean): void {
    if (areAllSelected) {
      this.profileSearchEngineService.search(this.activeSearchTerm(), 0, 10000).subscribe((result) => {
        result.getResults().forEach((entry) => {
          if (!this.isProfileSelected(entry.getUrl())) {
            this.selectedProfileService.addToSelection(entry)
          }
        })
      })
    } else {
      this.profileSearchEngineService.search(this.activeSearchTerm(), 0, 10000).subscribe((result) => {
        result.getResults().forEach((entry) => {
          if (this.isProfileSelected(entry.getUrl())) {
            this.selectedProfileService.removeFromSelection(entry)
          }
        })
      })
    }
  }
}
