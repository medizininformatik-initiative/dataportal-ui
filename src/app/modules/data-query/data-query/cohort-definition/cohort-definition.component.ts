import { CohortDefinitionActionBarComponent } from './action-bar/cohort-definition-action-bar.component'
import { Component, inject } from '@angular/core'
import { DisplayFeasibilityQueryComponent } from '../../../feasibility-query/components/editor/display/display.component'
import { HeaderComponent } from '../../../../shared/components/header/header.component'
import { HeaderDescriptionComponent } from '../../../../shared/components/header-description/header-description.component'
import { map } from 'rxjs'
import { MatStep, MatStepLabel, MatStepper } from '@angular/material/stepper'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { PlaceholderBoxComponent } from '../../../../shared/components/placeholder-box/placeholder-box.component'
import { ResultProviderService } from 'src/app/service/Provider/ResultProvider.service'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'
import { FeasibilityQueryValidationService } from 'src/app/service/Criterion/Validation/FeasibilityQueryValidationService.service'

@Component({
  selector: 'num-cohort-definition',
  templateUrl: './cohort-definition.component.html',
  styleUrls: ['./cohort-definition.component.scss'],
  standalone: true,
  imports: [
    MatStepper,
    MatStep,
    MatStepLabel,
    HeaderComponent,
    HeaderDescriptionComponent,
    DisplayFeasibilityQueryComponent,
    PlaceholderBoxComponent,
    CohortDefinitionActionBarComponent,
    TranslateModule,
  ],
})
export class CohortDefinitionComponent {
  private readonly navigationHelperService = inject(NavigationHelperService)
  private readonly feasibilityQueryValidation = inject(FeasibilityQueryValidationService)
  private readonly resultProviderService = inject(ResultProviderService)

  readonly isFeasibilityExistent = this.feasibilityQueryValidation.isFeasibilityQueryValid

  readonly totalNumberOfPatients = toSignal(
    this.resultProviderService
      .getResultOfActiveFeasibilityQuery()
      .pipe(map((result) => result?.getTotalNumberOfPatients() ?? 0)),
    { initialValue: 0 }
  )

  public sendQuery(): void {
    this.navigationHelperService.navigateToFeasibilityQueryResult()
  }

  public navigatToDataQueryDataSelection(): void {
    this.navigationHelperService.navigateToDataQueryDataSelection()
  }
}
