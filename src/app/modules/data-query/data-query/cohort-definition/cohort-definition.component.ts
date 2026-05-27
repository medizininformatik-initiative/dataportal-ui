import { AsyncPipe } from '@angular/common'
import { CohortDefinitionActionBarComponent } from './action-bar/cohort-definition-action-bar.component'
import { Component, inject, OnInit } from '@angular/core'
import { DisplayFeasibilityQueryComponent } from '../../../feasibility-query/components/editor/display/display.component'
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service'
import { FeasibilityQueryValidationService } from 'src/app/service/FeasibilityQuery/FeasibilityQueryValidation.service'
import { filter, Observable } from 'rxjs'
import { HeaderComponent } from '../../../../shared/components/header/header.component'
import { HeaderDescriptionComponent } from '../../../../shared/components/header-description/header-description.component'
import { MatStep, MatStepLabel, MatStepper } from '@angular/material/stepper'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { PlaceholderBoxComponent } from '../../../../shared/components/placeholder-box/placeholder-box.component'
import { ResultProviderService } from 'src/app/service/Provider/ResultProvider.service'
import { TranslateModule } from '@ngx-translate/core'

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
    AsyncPipe,
    TranslateModule,
  ],
})
export class CohortDefinitionComponent implements OnInit {
  private routerHelperService = inject(NavigationHelperService)
  private feasibilityQueryService = inject(FeasibilityQueryProviderService)
  private feasibilityQueryValidation = inject(FeasibilityQueryValidationService)
  private resultProviderService = inject(ResultProviderService)
  private navigationHelperService = inject(NavigationHelperService)

  fileName: string
  isFeasibilityExistent$: Observable<boolean>
  totalNumberOfPatients: number

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit() {
    this.feasibilityQueryService
      .getActiveFeasibilityQuery()
      .pipe(filter((feasibilityQuery) => !!feasibilityQuery))
      .subscribe((feasibilityQuery) => {
        const resultIdsLength = feasibilityQuery.getResultIds().length
        if (resultIdsLength === 0) {
          return
        } else {
          this.totalNumberOfPatients = this.resultProviderService
            .getOne(feasibilityQuery.getResultIds()[resultIdsLength - 1])
            ?.getTotalNumberOfPatients()
        }
      })
    this.isFeasibilityExistent$ = this.feasibilityQueryValidation.getIsFeasibilityQuerySet()
  }

  public sendQuery() {
    this.routerHelperService.navigateToFeasibilityQueryResult()
  }

  public navigatToDataQueryDataSelection() {
    this.navigationHelperService.navigateToDataQueryDataSelection()
  }
}
