import { Injectable, inject } from '@angular/core'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { MenuServiceDataSelectionFunctions } from './MenuServiceDataSelectionFunctions'

@Injectable({
  providedIn: 'root',
})
export class MenuServiceDataSelection {
  private menuServiceDataSelectionFunctions = inject(MenuServiceDataSelectionFunctions)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * @returns Array of Menu functions for a dataselection profile box
   */
  public getMenuItemsForDataSelection(isMainProfile: boolean): MenuItemInterface[] {
    return [
      {
        disabled: false,
        icon: 'pencil-alt',
        label: 'EDIT',
        action: (id: string) =>
          this.menuServiceDataSelectionFunctions.redirectToDataSelectionEditPage(id),
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
        action: (url: string) =>
          this.menuServiceDataSelectionFunctions.deleteDataSelectionObject(url),
      },
    ]
  }
}
