import { Component, inject, input } from '@angular/core'
import { HeaderComponent } from '../../../../shared/components/header/header.component'
import { MatStep, MatStepLabel, MatStepper } from '@angular/material/stepper'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { TranslateModule } from '@ngx-translate/core'

/**
 * Frame of the two data-query pages (cohort, data selection): stepper and intro on top, the
 * content in the remaining height, the action bar at the bottom.
 * Slots: `<num-header-description>` (intro), `<... actions>` (action bar), the rest is the content.
 */
@Component({
  selector: 'num-query-page',
  templateUrl: './query-page.component.html',
  styleUrls: ['./query-page.component.scss'],
  standalone: true,
  imports: [MatStepper, MatStep, MatStepLabel, HeaderComponent, TranslateModule],
})
export class QueryPageComponent {
  private readonly navigationHelperService = inject(NavigationHelperService)

  /** 0 = cohort definition, 1 = data selection */
  readonly step = input.required<0 | 1>()

  public navigateToStep(index: number): void {
    if (index === 0) {
      this.navigationHelperService.navigateToDataQueryCohortDefinition()
    } else {
      this.navigationHelperService.navigateToDataQueryDataSelection()
    }
  }
}
