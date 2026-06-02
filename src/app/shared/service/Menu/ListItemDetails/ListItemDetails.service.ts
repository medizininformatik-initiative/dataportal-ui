import { Injectable, inject } from '@angular/core'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { ListItemDetailsMenuItemsFunctionsService } from './ListItemDetailsMenuItemsFunctions.service'

@Injectable({
  providedIn: 'root',
})
export class ListItemDetailService {
  private listItemDetailsFunctionService = inject(ListItemDetailsMenuItemsFunctionsService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * @todo Labels need to be redefined for translation jsons
   * @returns Array of Menu functions for a criterion box
   */
  public getMenuItemsListItemDetails(selectable: boolean): MenuItemInterface[] {
    return [
      {
        disabled: false,
        icon: 'search',
        label: 'SEARCH',
        action: (id: string) => this.listItemDetailsFunctionService.searchCriteria(id),
      },
      {
        disabled: false,
        icon: 'eye',
        label: 'SHOW_CRITERIA',
        action: (id: string) => this.listItemDetailsFunctionService.showCriteriaInResultList(id),
      },
      {
        disabled: !selectable,
        icon: 'plus',
        label: 'ADD',
        action: (id: string) => this.listItemDetailsFunctionService.addToStage(id),
      },
    ]
  }
}
