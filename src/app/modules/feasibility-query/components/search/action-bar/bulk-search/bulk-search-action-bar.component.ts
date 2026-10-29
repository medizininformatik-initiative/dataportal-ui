import { Component, computed, inject, input } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'
import { CreateBulkCriterionService } from 'src/app/service/CreateBulkCriterion.service'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { FeasibilityQueryProviderHub } from 'src/app/service/Provider/FeasibilityQueryProviderHub'
import { SelectedBulkCriteriaProvider } from 'src/app/service/SelectedBulkCriteria.service'
import { ActionBarComponent } from '../../../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../../../shared/components/button/button.component'

@Component({
  selector: 'num-bulk-search-action-bar',
  templateUrl: './bulk-search-action-bar.component.html',
  styleUrls: ['./bulk-search-action-bar.component.scss'],
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, MatTooltip, TranslateModule],
})
export class BulkSearchActionBarComponent {
  private readonly selectedBulkCriteriaService = inject(SelectedBulkCriteriaProvider)
  private readonly navigationHelperService = inject(NavigationHelperService)
  private readonly feasibilityQueryProviderHub = inject(FeasibilityQueryProviderHub)
  private readonly createBulkCriterionService = inject(CreateBulkCriterionService)

  public readonly resultType = input<
    'FOUND' | 'NOTFOUND'
    /** Inserted by Angular inject() migration for backwards compatibility */
  >(undefined)

  private readonly selectedEntries = toSignal(this.selectedBulkCriteriaService.getSelected(), {
    initialValue: [],
  })

  public readonly disabledAddToStageButton = computed(() => this.selectedEntries().length === 0)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {}

  public addItemsToStage(): void {
    const entries = this.selectedEntries()
    this.selectedBulkCriteriaService.setSearchResults(entries)
    this.selectedBulkCriteriaService.deselect(entries)
    const uiProfileId = this.selectedBulkCriteriaService.getUiProfileId()
    const criterion = this.createBulkCriterionService.createBulkCriterion(entries, uiProfileId)
    this.feasibilityQueryProviderHub.addCriteriaToStage([criterion])
    this.feasibilityQueryProviderHub.addCriteriaToCriterionProvider([criterion])
  }

  public navigateToEditor(): void {
    this.navigationHelperService.navigateToFeasibilityQueryEditor()
  }
}
