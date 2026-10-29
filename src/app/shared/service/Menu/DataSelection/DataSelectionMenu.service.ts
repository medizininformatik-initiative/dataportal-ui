import { inject, Injectable } from '@angular/core'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { AbstractMenuItemsService } from '../AbstractMenuItems.service'
import { DataSelectionMenuFunctionsService } from './DataSelectionMenuFunctions.service'

@Injectable({
  providedIn: 'root',
})
export class DataSelectionMenuService extends AbstractMenuItemsService<[boolean]> {
  private readonly menuServiceDataSelectionFunctions = inject(DataSelectionMenuFunctionsService)

  constructor() {
    super()
  }

  /**
   * Returns the menu items for this context.
   * @returns {MenuItemInterface[]} Array of Menu functions for a dataselection profile box
   * @param {boolean} isMainProfile
   */
  public getMenuItems(isMainProfile: boolean): MenuItemInterface[] {
    return [
      {
        disabled: false,
        icon: 'pencil-alt',
        label: 'EDIT',
        action: (id: string) => this.menuServiceDataSelectionFunctions.redirectToDataSelectionEditPage(id),
      },
      {
        disabled: isMainProfile,
        icon: 'clone',
        label: 'DUPLICATE',
        action: (id: string) => this.menuServiceDataSelectionFunctions.cloneDataSelectionObject(id),
      },
      {
        disabled: isMainProfile,
        icon: 'trash',
        label: 'DELETE',
        action: (url: string) => this.menuServiceDataSelectionFunctions.deleteDataSelectionObject(url),
      },
    ]
  }
}
