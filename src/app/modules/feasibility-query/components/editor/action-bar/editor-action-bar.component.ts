import { Component, computed, inject, OnInit } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { FeasibilityQueryValidationService } from 'src/app/service/Validation/Internal/FeasibilityQueryValidationService.service'
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
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

  public readonly isFeasibilityQueryValid = computed(() => this.validationService.validationState().isValid)
  constructor() {}

  public ngOnInit(): void {}

  public navigateToSearch(): void {
    this.navigation.navigateToFeasibilityQuerySearch()
  }

  public navigateToBulkCriteriaSearch(): void {
    this.navigation.navigateToFeasibilityQueryBulkSearch()
  }

  public sendRequest(): void {
    this.navigation.navigateToFeasibilityQueryResult()
  }
}
