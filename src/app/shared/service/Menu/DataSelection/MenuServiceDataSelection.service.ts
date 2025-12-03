import { Injectable } from '@angular/core';
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface';
import { MenuServiceDataSelectionFunctions } from './MenuServiceDataSelectionFunctions';

@Injectable({
  providedIn: 'root',
})
export class MenuServiceDataSelection {
  constructor(private menuServiceDataSelectionFunctions: MenuServiceDataSelectionFunctions) {}

  /**
   * @returns Array of Menu functions for a dataselection profile box
   */
  public getMenuItemsForDataSelection(isMainProfile: boolean): MenuItemInterface[] {
    return [
      {
        disabled: false,
        icon: 'wrench',
        label: 'EDIT',
        action: (id: string) =>
          this.menuServiceDataSelectionFunctions.redirectToDataSelectionEditPage(id),
      },
      {
        disabled: isMainProfile,
        icon: 'trash',
        label: 'DELETE',
        action: (url: string) =>
          this.menuServiceDataSelectionFunctions.deleteDataSelectionObject(url),
      },
      {
        disabled: isMainProfile,
        icon: 'clone',
        label: 'DUPLICATE',
        action: (id: string) => this.menuServiceDataSelectionFunctions.cloneDataSelectionObject(id),
      },
    ];
  }
}
