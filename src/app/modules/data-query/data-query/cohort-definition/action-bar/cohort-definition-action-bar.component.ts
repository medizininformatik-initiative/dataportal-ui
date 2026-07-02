import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { Component, inject } from '@angular/core'
import { FeasibilityQueryFactoryService } from 'src/app/service/FeasibilityQueryFactory.service'
import { FeasibilityQueryValidationService } from 'src/app/service/Criterion/Validation/FeasibilityQueryValidationService.service'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-cohort-definition-action-bar',
  templateUrl: './cohort-definition-action-bar.component.html',
  styleUrls: ['./cohort-definition-action-bar.component.scss'],
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, TranslateModule],
})
export class CohortDefinitionActionBarComponent {
  private routerHelperService = inject(NavigationHelperService)
  private navigationHelperService = inject(NavigationHelperService)
  private feasibilityQueryFactoryService = inject(FeasibilityQueryFactoryService)
  private feasibilityQueryValidationService = inject(FeasibilityQueryValidationService)

  readonly isFeasibilityQueryValid = this.feasibilityQueryValidationService.isFeasibilityQueryValid

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
