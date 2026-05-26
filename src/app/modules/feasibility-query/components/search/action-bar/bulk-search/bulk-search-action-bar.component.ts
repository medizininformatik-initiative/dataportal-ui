import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { CreateBulkCriterionService } from 'src/app/service/CreateBulkCriterion.service'
import { CriteriaBulkEntry } from 'src/app/model/Search/ListEntries/CriteriaBulkEntry'
import { FeasibilityQueryProviderHub } from 'src/app/service/Provider/FeasibilityQueryProviderHub'
import { FeasibilityQueryValidationService } from 'src/app/service/FeasibilityQuery/FeasibilityQueryValidation.service'
import { map, Observable, of, Subscription, take } from 'rxjs'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { SelectedBulkCriteriaProvider } from 'src/app/service/SelectedBulkCriteria.service'
import { StageProviderService } from 'src/app/service/Provider/StageProvider.service'
import { ActionBarComponent } from '../../../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../../../shared/components/button/button.component'
import { MatTooltip } from '@angular/material/tooltip'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-bulk-search-action-bar',
  templateUrl: './bulk-search-action-bar.component.html',
  styleUrls: ['./bulk-search-action-bar.component.scss'],
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, MatTooltip, AsyncPipe, TranslateModule],
})
export class BulkSearchActionBarComponent implements OnInit, OnDestroy {
  listItemArray$: Observable<CriteriaBulkEntry[]>
  stageArray$: Observable<string[]>
  isFeasibilityExistent$: Observable<boolean>
  disabledAddToStageButton: Observable<boolean> = of(true)
  addToStageSubscription: Subscription

  @Input()
  resultType: 'FOUND' | 'NOTFOUND'
  constructor(
    private selectedBulkCriteriaService: SelectedBulkCriteriaProvider,
    private stageProviderService: StageProviderService,
    private navigationHelperService: NavigationHelperService,
    private feasibilityQueryProviderHub: FeasibilityQueryProviderHub,
    private feasibilityQueryValidation: FeasibilityQueryValidationService,
    private createBulkCriterionService: CreateBulkCriterionService
  ) {}

  ngOnInit() {
    this.disabledAddToStageButton = this.selectedBulkCriteriaService
      .getSelected()
      .pipe(map((entries) => entries.length === 0))
    this.listItemArray$ = this.selectedBulkCriteriaService.getSelected()
    this.stageArray$ = this.stageProviderService.getAll()
    this.isFeasibilityExistent$ = this.feasibilityQueryValidation.getIsFeasibilityQuerySet()
  }

  ngOnDestroy() {
    this.addToStageSubscription?.unsubscribe()
  }

  public addItemsToStage() {
    this.addToStageSubscription?.unsubscribe()
    this.addToStageSubscription = this.selectedBulkCriteriaService
      .getSelected()
      .pipe(
        take(1),
        map((entries) => {
          this.selectedBulkCriteriaService.setSearchResults(entries)
          this.selectedBulkCriteriaService.deselect(entries)
          const uiProfileId = this.selectedBulkCriteriaService.getUiProfileId()
          const criterion = this.createBulkCriterionService.createBulkCriterion(
            entries,
            uiProfileId
          )
          this.feasibilityQueryProviderHub.addCriteriaToStage([criterion])
          this.feasibilityQueryProviderHub.addCriteriaToCriterionProvider([criterion])
          return entries
        })
      )
      .subscribe()
  }

  public navigateToEditor(): void {
    this.navigationHelperService.navigateToFeasibilityQueryEditor()
  }
}
