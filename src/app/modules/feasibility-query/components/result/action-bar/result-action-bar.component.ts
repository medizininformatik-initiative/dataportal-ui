import { Component, OnDestroy, OnInit, inject, input } from '@angular/core'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { Subscription } from 'rxjs'
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { TranslateModule } from '@ngx-translate/core'

/**
 * @todo add save button for feasibility and download button. Save and download should be active once a result is available.
 */
@Component({
  selector: 'num-result-action-bar',
  templateUrl: './result-action-bar.component.html',
  styleUrls: ['./result-action-bar.component.scss'],
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, TranslateModule],
})
export class ResultActionBarComponent implements OnInit, OnDestroy {
  private navigationHelperService = inject(NavigationHelperService)

  readonly hasQueryResult = input<boolean>(undefined)

  saveDataQueryModalSubscription: Subscription

  constructor() {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.saveDataQueryModalSubscription?.unsubscribe()
  }

  public editStage(): void {
    this.navigationHelperService.navigateToFeasibilityQueryEditor()
  }
}
