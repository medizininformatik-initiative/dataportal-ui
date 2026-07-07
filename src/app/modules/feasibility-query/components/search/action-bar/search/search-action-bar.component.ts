import { ActionBarComponent } from '../../../../../../shared/components/action-bar/action-bar.component'
import { BuildCriterionService } from 'src/app/service/Criterion/Build/BuildCriterionService'
import { ButtonComponent } from '../../../../../../shared/components/button/button.component'
import { Component, computed, DestroyRef, inject } from '@angular/core'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { FeasibilityQueryProviderHub } from 'src/app/service/Provider/FeasibilityQueryProviderHub'
import { MatBadge } from '@angular/material/badge'
import { MatTooltip } from '@angular/material/tooltip'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { SelectedTableItemsProvider } from 'src/app/service/Provider/SelectedTableItemsProvider.service'
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service'
import { StageProviderService } from 'src/app/service/Provider/StageProvider.service'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { tap } from 'rxjs'
import { TranslateModule } from '@ngx-translate/core'
import { FeasibilityQueryValidationService } from 'src/app/service/Validation/Internal/FeasibilityQueryValidationService.service'

@Component({
  selector: 'num-search-action-bar',
  templateUrl: './search-action-bar.component.html',
  styleUrls: ['./search-action-bar.component.scss'],
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, MatBadge, MatTooltip, TranslateModule],
})
export class SearchActionBarComponent {
  private readonly listItemService = inject<SelectedTableItemsProvider<CriteriaListEntry>>(
    SelectedTableItemsProvider
  )
  private readonly buildCriterionService = inject(BuildCriterionService)
  private readonly stageProviderService = inject(StageProviderService)
  private readonly navigationHelperService = inject(NavigationHelperService)
  private readonly feasibilityQueryProviderHub = inject(FeasibilityQueryProviderHub)
  private readonly feasibilityQueryValidationService = inject(FeasibilityQueryValidationService)
  private readonly snackbarService = inject(SnackbarService)
  private readonly destroyRef = inject(DestroyRef)

  readonly selectedItems = toSignal(this.listItemService.getItems(), {
    initialValue: [] as CriteriaListEntry[],
  })

  readonly stageItems = toSignal(this.stageProviderService.getAll(), {
    initialValue: [] as string[],
  })

  readonly isFeasibilityExistent = this.feasibilityQueryValidationService.validationState().isValid

  readonly canViewStage = computed(() => this.stageItems().length > 0 || this.isFeasibilityExistent)

  public addItemsToStage(): void {
    const ids = this.listItemService.getIds()
    this.buildCriterionService
      .buildCriteriaFromHashes(ids, true)
      .pipe(
        tap((criteria: Criterion[]) => {
          this.feasibilityQueryProviderHub.addCriteriaToCriterionProvider(criteria)
          this.feasibilityQueryProviderHub.addCriteriaToStage(criteria)
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() =>
        this.snackbarService.displayInfoMessage('FEASIBILITY.SEARCH.SNACKBAR.ADDED_TO_COHORT')
      )
  }

  public navigateToEditor(): void {
    this.navigationHelperService.navigateToFeasibilityQueryEditor()
  }
}
