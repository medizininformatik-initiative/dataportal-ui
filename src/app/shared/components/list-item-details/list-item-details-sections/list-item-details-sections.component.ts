import { Component, OnInit, inject, input, output } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { CriteriaEntryRelative } from 'src/app/model/Search/EntryDetails/Criteria/CriteriaEntryRelative'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { CriteriaByIdSearchService } from 'src/app/service/Search/SearchTypes/CriteriaById/CriteriaByIdSearch.service'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { CriteriaListItemDetailsMenuService } from 'src/app/shared/service/Menu/ListItemDetails/Criteria/CriteriaListItemDetailsMenu.service'
import { DisplayTranslationPipe } from '../../../pipes/DisplayTranslationPipe'
import { MenuComponent } from '../../menu/menu.component'

@Component({
  selector: 'num-list-item-details-sections',
  templateUrl: './list-item-details-sections.component.html',
  styleUrls: ['./list-item-details-sections.component.scss'],
  standalone: true,
  imports: [MatTooltip, MenuComponent, DisplayTranslationPipe],
})
export class ListItemDetailsSectionsComponent implements OnInit {
  private readonly menuService = inject(CriteriaListItemDetailsMenuService)
  private readonly criteriaByIdSearchService = inject(CriteriaByIdSearchService)

  public readonly listItemDetails = input<CriteriaEntryRelative[]>()

  public menuItemsTrue: MenuItemInterface[] = []
  public menuItemsFalse: MenuItemInterface[] = []

  public terminology = ''

  public readonly selectedRelative = output<CriteriaListEntry>()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public ngOnInit() {
    this.getMenuItems()
  }

  public getSelectedRelative(item: CriteriaEntryRelative) {
    this.criteriaByIdSearchService.search(item.getContextualizedTermcodeHash()).subscribe((resultList: CriteriaResultList) => {
      this.selectedRelative.emit(resultList.getResults()[0])
    })
  }

  private getMenuItems() {
    this.menuItemsTrue = this.menuService.getMenuItems(true)
    this.menuItemsFalse = this.menuService.getMenuItems(false)
  }
}
