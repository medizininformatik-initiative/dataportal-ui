import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { DataQueryValidationService } from 'src/app/service/DataQuery/DataQueryValidation.service'
import { FeasibilityQueryValidationService } from 'src/app/service/FeasibilityQuery/FeasibilityQueryValidation.service'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { Observable, of, Subscription } from 'rxjs'
import { StageProviderService } from '../../../../../service/Provider/StageProvider.service'
import { ValidDataQuery } from 'src/app/model/Types/ValidDataQuery'
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { MatTooltip } from '@angular/material/tooltip'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-editor-action-bar',
  templateUrl: './editor-action-bar.component.html',
  styleUrls: ['./editor-action-bar.component.scss'],
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, MatTooltip, AsyncPipe, TranslateModule],
})
export class EditorActionBarComponent implements OnInit, OnDestroy {
  private dataQueryValidation = inject(DataQueryValidationService)
  private feasibilityQueryValidation = inject(FeasibilityQueryValidationService)
  private stageProviderService = inject(StageProviderService)
  private navigationHelperService = inject(NavigationHelperService)

  stageArray$: Observable<Array<string>> = of([])
  isFeasibilityQueryValid$: Observable<boolean>

  validDataQuery$: Observable<ValidDataQuery>

  saveDataQueryModalSubscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit() {
    this.isFeasibilityQueryValid$ = this.feasibilityQueryValidation.getIsFeasibilityQueryValid()
    this.validDataQuery$ = this.dataQueryValidation.validateDataQuery()
  }

  ngOnDestroy() {
    this.saveDataQueryModalSubscription?.unsubscribe()
  }

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
