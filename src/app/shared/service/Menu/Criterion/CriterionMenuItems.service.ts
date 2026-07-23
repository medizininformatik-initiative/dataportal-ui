import { Injectable, inject } from '@angular/core'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { AbstractMenuItemsService } from '../AbstractMenuItems.service'
import { CriterionMenuFunctionsService } from './CriterionMenuFunctions.service'

@Injectable({
  providedIn: 'root',
})
export class CriterionMenuItemsService extends AbstractMenuItemsService {
  private menuServiceCriterionFunctions = inject(CriterionMenuFunctionsService)

  /**
   * @returns Array of Menu functions for a criterion box
   */
  public getMenuItems(): MenuItemInterface[] {
    return [
      {
        disabled: false,
        icon: 'pencil-alt',
        label: 'EDIT',
        action: (id: string) => this.menuServiceCriterionFunctions.editCriterionFilter(id),
      },
      {
        disabled: false,
        icon: 'clone',
        label: 'DUPLICATE',
        action: (id: string) => this.menuServiceCriterionFunctions.duplicateCriterion(id),
      },
      {
        disabled: false,
        icon: 'trash',
        label: 'DELETE',
        action: (id: string) => this.menuServiceCriterionFunctions.deleteCriterion(id),
      },
    ]
  }
}
