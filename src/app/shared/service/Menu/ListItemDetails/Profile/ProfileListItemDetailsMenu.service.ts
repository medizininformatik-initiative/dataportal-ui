import { Injectable, inject } from '@angular/core'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { AbstractMenuItemsService } from '../../AbstractMenuItems.service'
import { ProfileListItemDetailsMenuItemsFunctionsService } from './ProfileListItemDetailsMenuItemsFunctions.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileListItemDetailsMenuService extends AbstractMenuItemsService<[boolean]> {
  private listItemDetailsFunctionService = inject(ProfileListItemDetailsMenuItemsFunctionsService)

  public override getMenuItems(selectable: boolean): MenuItemInterface[] {
    return [
      {
        disabled: false,
        icon: 'search',
        label: 'SEARCH_PROFILE',
        action: (id: string) => this.listItemDetailsFunctionService.searchProfile(id),
      },
      {
        disabled: false,
        icon: 'eye',
        label: 'SHOW_PROFILE',
        action: (id: string) => this.listItemDetailsFunctionService.showProfileInResultList(id),
      },
      {
        disabled: !selectable,
        icon: 'plus',
        label: 'ADD',
        action: (id: string) => this.listItemDetailsFunctionService.addToDataSelection(id),
      },
    ]
  }
}
