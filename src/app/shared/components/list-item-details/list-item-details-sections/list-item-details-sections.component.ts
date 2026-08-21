import { Component, OnInit, inject, input, output } from '@angular/core'
import { CriteriaByIdSearchService } from 'src/app/service/Search/SearchTypes/CriteriaById/CriteriaByIdSearch.service'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { CriteriaListItemDetailsMenuService } from 'src/app/shared/service/Menu/ListItemDetails/Criteria/CriteriaListItemDetailsMenu.service'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { CriteriaEntryRelative } from 'src/app/model/Search/EntryDetails/Criteria/CriteriaEntryRelative'
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
  private menuService = inject(CriteriaListItemDetailsMenuService)
  private criteriaByIdSearchService = inject(CriteriaByIdSearchService)

  readonly listItemDetails = input<CriteriaEntryRelative[]>()

  menuItemsTrue: MenuItemInterface[] = []
  menuItemsFalse: MenuItemInterface[] = []

  terminology = ''

  readonly selectedRelative = output<CriteriaListEntry>()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public ngOnInit() {
    this.getMenuItems()
  }

  public getSelectedRelative(item: CriteriaEntryRelative) {
    this.criteriaByIdSearchService
      .search(item.getContextualizedTermcodeHash())
      .subscribe((resultList) => {
        this.selectedRelative.emit(resultList.getResults()[0])
      })
  }

  private getMenuItems() {
    this.menuItemsTrue = this.menuService.getMenuItems(true)
    this.menuItemsFalse = this.menuService.getMenuItems(false)
  }
}
