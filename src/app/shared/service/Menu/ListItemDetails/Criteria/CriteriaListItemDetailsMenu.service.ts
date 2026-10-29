import { Injectable, inject } from '@angular/core'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { AbstractMenuItemsService } from '../../AbstractMenuItems.service'
import { CriteriaListItemDetailsMenuItemsFunctionsService } from './CriteriaListItemDetailsMenuItemsFunctions.service'

@Injectable({
  providedIn: 'root',
})
export class CriteriaListItemDetailsMenuService extends AbstractMenuItemsService<[boolean]> {
  private readonly listItemDetailsFunctionService = inject(CriteriaListItemDetailsMenuItemsFunctionsService)

  constructor() {
    super()
  }

  /**
   * Returns the menu items for this context.
   * @todo Labels need to be redefined for translation jsons
   * @returns {MenuItemInterface[]} Array of Menu functions for a criterion box
   * @param {boolean} selectable
   */
  public override getMenuItems(selectable: boolean): MenuItemInterface[] {
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
        disabled: selectable,
        icon: 'plus',
        label: 'ADD',
        action: (id: string) => this.listItemDetailsFunctionService.addToStage(id),
      },
    ]
  }
}
