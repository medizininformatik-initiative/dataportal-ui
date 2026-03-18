import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CriteriaByIdSearchService } from 'src/app/service/Search/SearchTypes/CriteriaById/CriteriaByIdSearch.service';
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry';
import { ListItemDetailService } from 'src/app/shared/service/Menu/ListItemDetails/ListItemDetails.service';
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface';
import { SearchTermRelatives } from 'src/app/model/Search/SearchDetails/SearchTermRelatives';

@Component({
  selector: 'num-list-item-details-sections',
  templateUrl: './list-item-details-sections.component.html',
  styleUrls: ['./list-item-details-sections.component.scss'],
})
export class ListItemDetailsSectionsComponent implements OnInit {
  @Input()
  listItemDetails: SearchTermRelatives[];

  menuItemsTrue: MenuItemInterface[] = [];
  menuItemsFalse: MenuItemInterface[] = [];

  terminology = '';

  @Output()
  selectedRelative: EventEmitter<CriteriaListEntry> = new EventEmitter();

  constructor(
    private menuService: ListItemDetailService,
    private criteriaByIdSearchService: CriteriaByIdSearchService
  ) {}

  public ngOnInit() {
    this.getMenuItems();
  }

  public getSelectedRelative(item: SearchTermRelatives) {
    this.criteriaByIdSearchService
      .search(item.getContextualizedTermcodeHash())
      .subscribe((resultList) => {
        this.selectedRelative.emit(resultList.getResults()[0]);
      });
  }

  private getMenuItems() {
    this.menuItemsTrue = this.menuService.getMenuItemsListItemDetails(true);
    this.menuItemsFalse = this.menuService.getMenuItemsListItemDetails(false);
  }
}
