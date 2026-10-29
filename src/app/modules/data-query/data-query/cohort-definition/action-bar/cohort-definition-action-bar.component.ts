import { Component, inject } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { FeasibilityQueryFactoryService } from 'src/app/service/FeasibilityQueryFactory.service'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { FeasibilityQueryValidationService } from 'src/app/service/Validation/Internal/FeasibilityQueryValidationService.service'
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'

@Component({
  selector: 'num-cohort-definition-action-bar',
  templateUrl: './cohort-definition-action-bar.component.html',
  styleUrls: ['./cohort-definition-action-bar.component.scss'],
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, TranslateModule],
})
export class CohortDefinitionActionBarComponent {
  private readonly routerHelperService = inject(NavigationHelperService)
  private readonly navigationHelperService = inject(NavigationHelperService)
  private readonly feasibilityQueryFactoryService = inject(FeasibilityQueryFactoryService)
  private readonly feasibilityQueryValidationService = inject(FeasibilityQueryValidationService)

  public readonly isFeasibilityQueryValid = this.feasibilityQueryValidationService.validationState().isValid

  public sendQuery(): void {
    this.routerHelperService.navigateToFeasibilityQueryResult()
  }

  public createNewCohort(): void {
    this.feasibilityQueryFactoryService.instantiate()
    this.routerHelperService.navigateToFeasibilityQuerySearch()
  }

  public navigatToDataQueryDataSelection(): void {
    this.navigationHelperService.navigateToDataQueryDataSelection()
  }
}
