import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav'
import { SelectedTableItemsProvider } from 'src/app/service/Provider/SelectedTableItemsProvider.service'
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core'
import { CriteriaListEntry } from '../../../model/Search/ListEntries/CriteriaListListEntry'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { ListItemDetailsComponent } from '../shared-components.module'

@Component({
  selector: 'num-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  standalone: true,
  imports: [
    MatDrawerContainer,
    MatDrawer,
    FontAwesomeModule,
    ListItemDetailsComponent,
    MatDrawerContent,
  ],
})
export class SearchResultComponent implements OnInit, AfterViewInit {
  private listItemService = inject<SelectedTableItemsProvider<CriteriaListEntry>>(
    SelectedTableItemsProvider
  )
  private cdr = inject(ChangeDetectorRef)

  @ViewChild('drawer') sidenav: MatDrawer

  @Input()
  searchTermListItems: CriteriaListEntry[] = []

  @Input()
  keysToSkip: string[] = []

  private isInitialized = false

  data: CriteriaListEntry

  isOpen = false

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit() {
    this.listItemService.getActiveItem().subscribe((row) => {
      this.data = row
      if (this.isInitialized) {
        this.cdr.detectChanges()
        if (row) {
          this.openSidenav()
        } else {
          this.closeSidenav()
        }
      }
    })
  }

  ngAfterViewInit() {
    this.isInitialized = true
    this.cdr.detectChanges()
    if (this.data) {
      this.openSidenav()
    }
  }

  openSidenav() {
    if (this.sidenav) {
      this.isOpen = true
      this.sidenav.open()
    }
  }

  closeSidenav() {
    if (this.sidenav) {
      this.isOpen = false
      this.sidenav.close()
    }
  }
}
