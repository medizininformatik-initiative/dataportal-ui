import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { FeasibilityQueryValidationService } from 'src/app/service/Validation/Internal/FeasibilityQueryValidationService.service'
import { MatTooltip } from '@angular/material/tooltip'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { TranslateModule } from '@ngx-translate/core'
import { Component, computed, inject, OnInit } from '@angular/core'
@Component({
  selector: 'num-editor-action-bar',
  templateUrl: './editor-action-bar.component.html',
  styleUrls: ['./editor-action-bar.component.scss'],
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, MatTooltip, TranslateModule],
})
export class EditorActionBarComponent implements OnInit {
  private readonly validationService = inject(FeasibilityQueryValidationService)
  private readonly navigation = inject(NavigationHelperService)

  readonly isFeasibilityQueryValid = computed(
    () => this.validationService.validationState().isValid
  )
  constructor() {}

  ngOnInit(): void {}

  navigateToSearch(): void {
    this.navigation.navigateToFeasibilityQuerySearch()
  }

  navigateToBulkCriteriaSearch(): void {
    this.navigation.navigateToFeasibilityQueryBulkSearch()
  }

  sendRequest(): void {
    this.navigation.navigateToFeasibilityQueryResult()
  }
}
