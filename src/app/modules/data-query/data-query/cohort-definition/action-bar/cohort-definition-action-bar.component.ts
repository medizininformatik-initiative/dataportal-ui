import { Component, OnInit, inject } from '@angular/core'
import { FeasibilityQueryFactoryService } from 'src/app/service/FeasibilityQueryFactory.service'
import { FeasibilityQueryValidationService } from 'src/app/service/FeasibilityQuery/FeasibilityQueryValidation.service'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { Observable, Subscription } from 'rxjs'
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-cohort-definition-action-bar',
  templateUrl: './cohort-definition-action-bar.component.html',
  styleUrls: ['./cohort-definition-action-bar.component.scss'],
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, AsyncPipe, TranslateModule],
})
export class CohortDefinitionActionBarComponent implements OnInit {
  private routerHelperService = inject(NavigationHelperService)
  private navigationHelperService = inject(NavigationHelperService)
  private feasibilityQueryFactoryService = inject(FeasibilityQueryFactoryService)
  private feasibilityQueryValidation = inject(FeasibilityQueryValidationService)

  fileName: string
  isFeasibilityInclusionSet: Observable<boolean>
  isFeasibilityExistent: Observable<boolean>
  isFeasibilityQueryValid: Observable<boolean>
  totalNumberOfPatients: number
  downloadSubscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit() {
    this.isFeasibilityInclusionSet = this.feasibilityQueryValidation.getIsInclusionSet()
    this.isFeasibilityExistent = this.feasibilityQueryValidation.getIsFeasibilityQuerySet()
    this.isFeasibilityQueryValid = this.feasibilityQueryValidation.getIsFeasibilityQueryValid()
  }

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
