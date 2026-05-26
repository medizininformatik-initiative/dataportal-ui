import { BuildCriterionService } from 'src/app/service/Criterion/Build/BuildCriterionService'
import { Component, OnInit } from '@angular/core'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { FeasibilityQueryProviderHub } from 'src/app/service/Provider/FeasibilityQueryProviderHub'
import { FeasibilityQueryValidationService } from 'src/app/service/FeasibilityQuery/FeasibilityQueryValidation.service'
import { map, Observable, of } from 'rxjs'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { SelectedTableItemsProvider } from 'src/app/service/Provider/SelectedTableItemsProvider.service'
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service'
import { StageProviderService } from 'src/app/service/Provider/StageProvider.service'
import { ActionBarComponent } from '../../../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../../../shared/components/button/button.component'
import { MatBadge } from '@angular/material/badge'
import { MatTooltip } from '@angular/material/tooltip'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-search-action-bar',
  templateUrl: './search-action-bar.component.html',
  styleUrls: ['./search-action-bar.component.scss'],
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, MatBadge, MatTooltip, AsyncPipe, TranslateModule],
})
export class SearchActionBarComponent implements OnInit {
  listItemArray$: Observable<CriteriaListEntry[]> = of([])
  isFeasibilityExistent$: Observable<boolean>
  stageArray$: Observable<Array<string>> = of([])

  constructor(
    private listItemSelectionService: SelectedTableItemsProvider<CriteriaListEntry>,
    private buildCriterionService: BuildCriterionService,
    private stageProviderService: StageProviderService,
    private navigationHelperService: NavigationHelperService,
    private listItemService: SelectedTableItemsProvider<CriteriaListEntry>,
    private feasibilityQueryProviderHub: FeasibilityQueryProviderHub,
    private feasibilityQueryValidation: FeasibilityQueryValidationService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.listItemArray$ = this.listItemSelectionService.getItems()
    this.stageArray$ = this.stageProviderService.getAll()
    this.isFeasibilityExistent$ = this.feasibilityQueryValidation.getIsFeasibilityQuerySet()
  }

  public addItemsToStage() {
    const ids = this.listItemService.getIds()
    this.buildCriterionService
      .buildCriteriaFromHashes(ids)
      .pipe(
        map((criteria: Criterion[]) => {
          this.feasibilityQueryProviderHub.addCriteriaToCriterionProvider(criteria)
          this.feasibilityQueryProviderHub.addCriteriaToStage(criteria)
          return criteria
        })
      )
      .subscribe((criteria: Criterion[]) => {
        this.snackbarService.displayInfoMessage('FEASIBILITY.SEARCH.SNACKBAR.ADDED_TO_COHORT')
        this.listItemService.clear()
      })
  }

  public navigateToEditor() {
    this.navigationHelperService.navigateToFeasibilityQueryEditor()
  }
}
