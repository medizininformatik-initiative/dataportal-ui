import { MatDrawer } from '@angular/material/sidenav';
import { SelectedTableItemsProvider } from 'src/app/service/Provider/SelectedTableItemsProvider.service';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CriteriaListEntry } from '../../../model/Search/ListEntries/CriteriaListListEntry';

@Component({
  selector: 'num-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') sidenav: MatDrawer;

  @Input()
  searchTermListItems: CriteriaListEntry[] = [];

  @Input()
  keysToSkip: string[] = [];

  private isInitialized = false;

  data: CriteriaListEntry;

  isOpen = false;

  constructor(
    private listItemService: SelectedTableItemsProvider<CriteriaListEntry>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.listItemService.getActiveItem().subscribe((row) => {
      this.data = row;
      if (this.isInitialized) {
        this.cdr.detectChanges();
        if (row) {
          this.openSidenav();
        } else {
          this.closeSidenav();
        }
      }
    });
  }

  ngAfterViewInit() {
    this.isInitialized = true;
    this.cdr.detectChanges();
    if (this.data) {
      this.openSidenav();
    }
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
}
