import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core'
import { CriteriaByIdSearchService } from 'src/app/service/Search/SearchTypes/CriteriaById/CriteriaByIdSearch.service'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { ListItemDetailService } from 'src/app/shared/service/Menu/ListItemDetails/ListItemDetails.service'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { SearchTermRelatives } from 'src/app/model/Search/SearchDetails/SearchTermRelatives'
import { MatTooltip } from '@angular/material/tooltip'
import { MenuComponent } from '../../menu/menu.component'
import { DisplayTranslationPipe } from '../../../pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-list-item-details-sections',
  templateUrl: './list-item-details-sections.component.html',
  styleUrls: ['./list-item-details-sections.component.scss'],
  standalone: true,
  imports: [MatTooltip, MenuComponent, DisplayTranslationPipe],
})
export class ListItemDetailsSectionsComponent implements OnInit {
  private menuService = inject(ListItemDetailService)
  private criteriaByIdSearchService = inject(CriteriaByIdSearchService)

  @Input()
  listItemDetails: SearchTermRelatives[]

  menuItemsTrue: MenuItemInterface[] = []
  menuItemsFalse: MenuItemInterface[] = []

  terminology = ''

  @Output()
  selectedRelative: EventEmitter<CriteriaListEntry> = new EventEmitter()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public ngOnInit() {
    this.getMenuItems()
  }

  public getSelectedRelative(item: SearchTermRelatives) {
    this.criteriaByIdSearchService
      .search(item.getContextualizedTermcodeHash())
      .subscribe((resultList) => {
        this.selectedRelative.emit(resultList.getResults()[0])
      })
  }

  private getMenuItems() {
    this.menuItemsTrue = this.menuService.getMenuItemsListItemDetails(true)
    this.menuItemsFalse = this.menuService.getMenuItemsListItemDetails(false)
  }
}
