import { Injectable, inject } from '@angular/core'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { AbstractMenuItemsService } from '../AbstractMenuItems.service'
import { ProfileReferenceMenuFunctionsService } from './ProfileReferenceMenuFunctionsService.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileReferenceMenuService extends AbstractMenuItemsService<
  [string, (Record<string, unknown> | undefined)?]
> {
  private menuServiceDataSelectionFunctions = inject(ProfileReferenceMenuFunctionsService)

  /**
   * @returns Array of Menu functions for a dataselection profile box
   */
  public override getMenuItems(id: string, args?: Record<string, unknown>): MenuItemInterface[] {
    return [
      {
        disabled: false,
        icon: 'pencil-alt',
        label: 'EDIT',
        action: (id: string, args?: Record<string, unknown>) =>
          this.menuServiceDataSelectionFunctions.navigate(id, args),
      },
      {
        disabled: false,
        icon: 'trash',
        label: 'DELETE',
        action: (url: string) =>
          this.menuServiceDataSelectionFunctions.delete(url, args?.elementId as string),
      },
    ]
  }
}
