import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { Component, inject } from '@angular/core'
import { DataSelectionActionBarComponent } from './action-bar/data-selection-action-bar.component'
import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service'
import { DisplayProfilesComponent } from '../../../data-selection/components/editor/display/display-profiles/display-profiles.component'
import { FeasibilityQueryValidationService } from 'src/app/service/FeasibilityQuery/FeasibilityQueryValidation.service'
import { HeaderComponent } from '../../../../shared/components/header/header.component'
import { HeaderDescriptionComponent } from '../../../../shared/components/header-description/header-description.component'
import { map } from 'rxjs'
import { MatStep, MatStepLabel, MatStepper } from '@angular/material/stepper'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { PlaceholderBoxComponent } from '../../../../shared/components/placeholder-box/placeholder-box.component'
import { toSignal } from '@angular/core/rxjs-interop'
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
    TranslateModule,
  ],
})
export class DataSelectionComponent {
  private readonly dataSelectionProviderService = inject(DataSelectionProviderService)
  private readonly navigationHelperService = inject(NavigationHelperService)
  private readonly feasibilityQueryValidation = inject(FeasibilityQueryValidationService)
  private readonly appSettingsProviderService = inject(AppSettingsProviderService)

  readonly isDataSelectionExistent = toSignal(
    this.dataSelectionProviderService
      .getActiveDataSelection()
      .pipe(map((dataSelection) => dataSelection.getProfiles().length > 0)),
    { initialValue: false }
  )

  readonly isCohortExistent = toSignal(
    this.feasibilityQueryValidation.getIsFeasibilityQueryValid(),
    { initialValue: false }
  )

  readonly emailLink = this.appSettingsProviderService.getEmail()

  public navigateToDataQueryCohortDefinition(): void {
    this.navigationHelperService.navigateToDataQueryCohortDefinition()
  }
}
