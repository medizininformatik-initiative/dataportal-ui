import { inject, Injectable } from '@angular/core'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { AbstractMenuItemsService } from '../AbstractMenuItems.service'
import { ReferenceCriterionMenuFunctionsService } from './ReferenceCriterionMenuFunctions.service'

@Injectable({
  providedIn: 'root',
})
export class ReferenceCriterionMenuItemsService extends AbstractMenuItemsService {
  private referenceCriterionMenuFunctions = inject(ReferenceCriterionMenuFunctionsService)

  constructor() {
    super()
  }

  /**
   * @returns Array of Menu functions for a criterion box
   */
  public override getMenuItems(): MenuItemInterface[] {
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
