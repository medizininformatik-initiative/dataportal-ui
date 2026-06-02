import { Component, input, output, viewChild } from '@angular/core'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav'
import { Observable } from 'rxjs'
import { SearchTermDetails } from 'src/app/model/Search/SearchDetails/SearchTermDetails'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { ListItemDetailsComponent } from '../../../../../shared/components/list-item-details/list-item-details.component'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { TableComponent } from '../../../../../shared/components/table/table.component'
import { PlaceholderBoxComponent } from '../../../../../shared/components/placeholder-box/placeholder-box.component'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

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
    AsyncPipe,
    TranslateModule,
  ],
})
export class SearchResultsComponent {
  readonly drawer = viewChild<MatDrawer>('drawer')

  readonly listItems = input<CriteriaListEntry[]>([])
  readonly adaptedData = input<TableData>(undefined)
  readonly selectedDetails$ = input<Observable<SearchTermDetails>>(undefined)
  readonly searchText$ = input<Observable<string>>(undefined)
  readonly searchResultsFound = input(false)

  readonly selectedRow = output<TableRowData>()
  readonly rowClicked = output<TableRowData>()
  readonly iconClicked = output<TableRowData>()
  readonly loadMore = output<void>()
  readonly selectedRelative = output<CriteriaListEntry>()

  public openSidenav(): void {
    this.drawer()?.open()
  }

  public closeSidenav(): void {
    this.drawer()?.close()
  }
}
