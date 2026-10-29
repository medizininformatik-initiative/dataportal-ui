import { Component, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { MatStep, MatStepLabel, MatStepper } from '@angular/material/stepper'
import { TranslateModule } from '@ngx-translate/core'
import { map } from 'rxjs'
import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { FeasibilityQueryValidationService } from 'src/app/service/Validation/Internal/FeasibilityQueryValidationService.service'
import { HeaderComponent } from '../../../../shared/components/header/header.component'
import { HeaderDescriptionComponent } from '../../../../shared/components/header-description/header-description.component'
import { PlaceholderBoxComponent } from '../../../../shared/components/placeholder-box/placeholder-box.component'
import { DisplayProfilesComponent } from '../../../data-selection/components/editor/display/display-profiles/display-profiles.component'
import { DataSelectionActionBarComponent } from './action-bar/data-selection-action-bar.component'

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
  private readonly feasibilityQueryValidationService = inject(FeasibilityQueryValidationService)
  private readonly appSettingsProviderService = inject(AppSettingsProviderService)

  public readonly isDataSelectionExistent = toSignal(
    this.dataSelectionProviderService.getActiveDataSelection().pipe(map((dataSelection) => dataSelection.getProfiles().length > 0)),
    { initialValue: false }
  )

  public readonly isCohortExistent = this.feasibilityQueryValidationService.validationState().isValid

  public readonly emailLink = this.appSettingsProviderService.getEmail()

  public navigateToDataQueryCohortDefinition(): void {
    this.navigationHelperService.navigateToDataQueryCohortDefinition()
  }
}
