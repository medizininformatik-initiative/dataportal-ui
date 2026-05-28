import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service'
import { FeasibilityQueryValidationService } from 'src/app/service/FeasibilityQuery/FeasibilityQueryValidation.service'
import { map, Observable, Subscription } from 'rxjs'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { Component, ElementRef, OnDestroy, OnInit, inject, input, output } from '@angular/core'
import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { MatStepper, MatStep, MatStepLabel } from '@angular/material/stepper'
import { HeaderComponent } from '../../../../shared/components/header/header.component'
import { HeaderDescriptionComponent } from '../../../../shared/components/header-description/header-description.component'
import { PlaceholderBoxComponent } from '../../../../shared/components/placeholder-box/placeholder-box.component'
import { DisplayProfilesComponent } from '../../../data-selection/components/editor/display/display-profiles/display-profiles.component'
import { DataSelectionActionBarComponent } from './action-bar/data-selection-action-bar.component'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-data-selection',
  templateUrl: './data-selection.component.html',
  styleUrls: ['./data-selection.component.scss'],
  standalone: true,
  imports: [
    MatStepper,
    MatStep,
    MatStepLabel,
    HeaderComponent,
    HeaderDescriptionComponent,
    PlaceholderBoxComponent,
    DisplayProfilesComponent,
    DataSelectionActionBarComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class DataSelectionComponent implements OnInit, OnDestroy {
  elementRef = inject(ElementRef)
  private dataSelectionProviderService = inject(DataSelectionProviderService)
  private navigationHelperService = inject(NavigationHelperService)
  private feasibilityQueryValidation = inject(FeasibilityQueryValidationService)
  private appSettingsProviderService = inject(AppSettingsProviderService)

  isDataSelectionExistent$: Observable<boolean>
  isCohortExistent$: Observable<boolean>

  emailLink: string

  constructor() {}

  ngOnInit(): void {
    this.isDataSelectionExistent$ = this.dataSelectionProviderService
      .getActiveDataSelection()
      .pipe(map((dataSelection) => dataSelection.getProfiles().length > 0))

    this.isCohortExistent$ = this.feasibilityQueryValidation.getIsFeasibilityQueryValid()
    this.emailLink = this.appSettingsProviderService.getEmail()
  }

  ngOnDestroy(): void {}

  public navigateToDataQueryCohortDefinition() {
    this.navigationHelperService.navigateToDataQueryCohortDefinition()
  }
}
