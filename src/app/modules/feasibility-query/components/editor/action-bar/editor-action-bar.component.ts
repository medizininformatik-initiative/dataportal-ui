import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { Component, effect, inject, OnInit } from '@angular/core'
import { FeasibilityQueryValidationService } from 'src/app/service/Validation/FeasibilityQueryValidationService.service'
import { MatTooltip } from '@angular/material/tooltip'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { Observable, of } from 'rxjs'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-editor-action-bar',
  templateUrl: './editor-action-bar.component.html',
  styleUrls: ['./editor-action-bar.component.scss'],
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, MatTooltip, TranslateModule],
})
export class EditorActionBarComponent implements OnInit {
  private feasibilityQueryValidation = inject(FeasibilityQueryValidationService)
  private navigationHelperService = inject(NavigationHelperService)

  stageArray$: Observable<Array<string>> = of([])
  isFeasibilityQueryValid = this.feasibilityQueryValidation.validationState().isValid

  constructor() {
    effect(() => {
      this.feasibilityQueryValidation.validationState()
      this.isFeasibilityQueryValid = this.feasibilityQueryValidation.validationState().isValid
    })
  }

  ngOnInit() {}

  public navigateToSearch() {
    this.navigationHelperService.navigateToFeasibilityQuerySearch()
  }

  public doSendRequest(): void {
    this.navigationHelperService.navigateToFeasibilityQueryResult()
  }

  public navigateToBulkCriteriaSearch(): void {
    this.navigationHelperService.navigateToFeasibilityQueryBulkSearch()
  }
}
