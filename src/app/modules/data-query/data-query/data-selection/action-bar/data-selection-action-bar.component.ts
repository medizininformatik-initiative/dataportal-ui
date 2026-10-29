import { Component, ElementRef, OnDestroy, OnInit, inject } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { Observable, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { DataSelectionFactoryService } from 'src/app/service/DataSelection/Factory/DataSelection.factory.service'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { FeasibilityQueryValidationService } from '../../../../../service/Validation/Internal/FeasibilityQueryValidationService.service'
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'

@Component({
  selector: 'num-data-selection-action-bar',
  templateUrl: './data-selection-action-bar.component.html',
  styleUrls: ['./data-selection-action-bar.component.scss'],
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, TranslateModule],
})
export class DataSelectionActionBarComponent implements OnDestroy, OnInit {
  public elementRef = inject(ElementRef)
  private readonly dataSelectionProviderService = inject(DataSelectionProviderService)
  private readonly navigationHelperService = inject(NavigationHelperService)
  private readonly feasibilityQueryValidation = inject(FeasibilityQueryValidationService)
  private readonly dataSelectionFactoryService = inject(DataSelectionFactoryService)

  public isDataSelectionExistent$: Observable<boolean>
  public isCohortExistent$: Observable<boolean>
  public fileName: string
  private readonly subscription: Subscription

  public downloadSubscription: Subscription

  public mainProfileSubscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public ngOnInit(): void {
    this.isDataSelectionExistent$ = this.dataSelectionProviderService
      .getActiveDataSelection()
      .pipe(map((dataSelection) => dataSelection.getProfiles().length > 0))

    //this.isCohortExistent$ = this.feasibilityQueryValidation.getIsFeasibilityQueryValid()
  }

  public ngOnDestroy(): void {
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
