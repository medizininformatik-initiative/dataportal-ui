import { Component, computed, inject, input } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { MenuServiceCriterionFunctions } from '../../service/Menu/Criterion/MenuServiceCriterionFunctions'
import { MenuServiceDataSelectionFunctions } from '../../service/Menu/DataSelection/MenuServiceDataSelectionFunctions'

/**
 * @todo implemnent also for not linked in features
 */
export type MissingElement =
  | 'CRITERIUM_FILTER'
  | 'DATASELECTION_FILTER'
  | 'DATASELECTION_FIELD'
  | ''

@Component({
  selector: 'num-missing-filter',
  templateUrl: './missing-filter.component.html',
  styleUrl: './missing-filter.component.scss',
  standalone: true,
  imports: [TranslateModule],
})
export class MissingFilterComponent {
  private menuServiceCriterionFunctions = inject(MenuServiceCriterionFunctions)
  private menuServiceDataSelectionFunctions = inject(MenuServiceDataSelectionFunctions)

  readonly missingElementType = input<MissingElement>('')
  readonly elementId = input<string>('')

  readonly warningMessage = computed(() => {
    switch (this.missingElementType()) {
      case 'CRITERIUM_FILTER':
        return 'FEASIBILITY.EDITOR.REQUIRED_FILTER'
      case 'DATASELECTION_FIELD':
        return 'DATASELECTION.EDITOR.DISPLAY.NO_FIELDS'
      default:
        return ''
    }
  })

  readonly warningSignUrl = 'assets/img/alert-blue-white.png'

  constructor() {}

  navigateToEditPage(): void {
    switch (this.missingElementType()) {
      case 'CRITERIUM_FILTER':
        this.menuServiceCriterionFunctions.editCriterionFilter(this.elementId())
        break
      case 'DATASELECTION_FIELD':
        this.menuServiceDataSelectionFunctions.redirectToDataSelectionEditPage(this.elementId())
        break
    }
  }
}
