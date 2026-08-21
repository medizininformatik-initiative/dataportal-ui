import { Component, ElementRef, OnDestroy, OnInit, inject } from '@angular/core'
import { DataSelectionFactoryService } from 'src/app/service/DataSelection/Factory/DataSelection.factory.service'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { map } from 'rxjs/operators'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { Observable, Subscription } from 'rxjs'
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { TranslateModule } from '@ngx-translate/core'
import { FeasibilityQueryValidationService } from '../../../../../service/Validation/Internal/FeasibilityQueryValidationService.service'

@Component({
  selector: 'num-data-selection-action-bar',
  templateUrl: './data-selection-action-bar.component.html',
  styleUrls: ['./data-selection-action-bar.component.scss'],
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, TranslateModule],
})
export class DataSelectionActionBarComponent implements OnDestroy, OnInit {
  elementRef = inject(ElementRef)
  private dataSelectionProviderService = inject(DataSelectionProviderService)
  private navigationHelperService = inject(NavigationHelperService)
  private feasibilityQueryValidation = inject(FeasibilityQueryValidationService)
  private dataSelectionFactoryService = inject(DataSelectionFactoryService)

  isDataSelectionExistent$: Observable<boolean>
  isCohortExistent$: Observable<boolean>
  fileName: string
  private subscription: Subscription

  downloadSubscription: Subscription

  mainProfileSubscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit(): void {
    this.isDataSelectionExistent$ = this.dataSelectionProviderService
      .getActiveDataSelection()
      .pipe(map((dataSelection) => dataSelection.getProfiles().length > 0))

    //this.isCohortExistent$ = this.feasibilityQueryValidation.getIsFeasibilityQueryValid()
  }

  ngOnDestroy(): void {
    this.mainProfileSubscription?.unsubscribe()
    this.subscription?.unsubscribe()
  }

  public createNewDataSelection() {
    this.mainProfileSubscription?.unsubscribe()
    this.dataSelectionFactoryService.instantiate().subscribe()
    this.navigationHelperService.navigateToDataSelectionSearch()
  }

  public navigateToDataQueryCohortDefinition() {
    this.navigationHelperService.navigateToDataQueryCohortDefinition()
  }
}
