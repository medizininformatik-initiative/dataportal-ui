import { inject, Injectable } from '@angular/core'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { RefrenceCriterionMenuFunctionsService } from './RefrenceCriterionMenuFunctions.service'

@Injectable({
  providedIn: 'root',
})
export class ReferenceCriterionMenuItems {
  private referenceCriterionMenuFunctions = inject(RefrenceCriterionMenuFunctionsService)

  constructor() {}

  /**
   * @returns Array of Menu functions for a criterion box
   */
  public getMenuItemsForRefrenceCriterion(): MenuItemInterface[] {
    return [
      {
        disabled: false,
        icon: 'pencil-alt',
        label: 'EDIT',
        action: (id: string) =>
          this.referenceCriterionMenuFunctions.applyReferenceCriterionFilter(id),
      },
      {
        disabled: true,
        icon: 'clone',
        label: 'DUPLICATE',
        action: (id: string) => this.referenceCriterionMenuFunctions.deleteCriterion(id),
      },
      {
        disabled: false,
        icon: 'trash',
        label: 'DELETE',
        action: (id: string) => this.referenceCriterionMenuFunctions.deleteCriterion(id),
      },
    ]
  }
}
