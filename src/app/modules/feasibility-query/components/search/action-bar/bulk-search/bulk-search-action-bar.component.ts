import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CreateBulkCriterionService } from 'src/app/service/CreateBulkCriterion.service';
import { CriteriaBulkEntry } from 'src/app/model/Search/ListEntries/CriteriaBulkEntry';
import { FeasibilityQueryProviderHub } from 'src/app/service/Provider/FeasibilityQueryProviderHub';
import { FeasibilityQueryValidation } from 'src/app/service/Criterion/FeasibilityQueryValidation.service';
import { map, Observable, of, Subscription, take } from 'rxjs';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { SelectedBulkCriteriaService } from 'src/app/service/SelectedBulkCriteria.service';
import { StageProviderService } from 'src/app/service/Provider/StageProvider.service';

@Component({
  selector: 'num-bulk-search-action-bar',
  templateUrl: './bulk-search-action-bar.component.html',
  styleUrls: ['./bulk-search-action-bar.component.scss'],
})
export class BulkSearchActionBarComponent implements OnInit, OnDestroy {
  listItemArray$: Observable<CriteriaBulkEntry[]>;
  stageArray$: Observable<string[]>;
  isFeasibilityExistent$: Observable<boolean>;
  disabledAddToStageButton: Observable<boolean> = of(true);
  addToStageSubscription: Subscription;

  @Input()
  resultType: 'FOUND' | 'NOTFOUND';
  constructor(
    private selectedBulkCriteriaService: SelectedBulkCriteriaService,
    private stageProviderService: StageProviderService,
    private navigationHelperService: NavigationHelperService,
    private feasibilityQueryProviderHub: FeasibilityQueryProviderHub,
    private feasibilityQueryValidation: FeasibilityQueryValidation,
    private createBulkCriterionService: CreateBulkCriterionService
  ) {}

  ngOnInit() {
    console.log('Result Type in Action Bar:', this.resultType);
    this.disabledAddToStageButton = this.selectedBulkCriteriaService
      .getSelectedBulkCriteria()
      .pipe(map((entries) => entries.length === 0));
    this.listItemArray$ = this.selectedBulkCriteriaService.getSelectedBulkCriteria();
    this.stageArray$ = this.stageProviderService.getStageUIDArray();
    this.isFeasibilityExistent$ = this.feasibilityQueryValidation.getIsFeasibilityQuerySet();
  }

  ngOnDestroy() {
    this.addToStageSubscription?.unsubscribe();
  }

  public addItemsToStage() {
    this.addToStageSubscription?.unsubscribe();
    this.addToStageSubscription = this.selectedBulkCriteriaService
      .getSelectedBulkCriteria()
      .pipe(
        take(1),
        map((entries) => {
          this.selectedBulkCriteriaService.setFoundEntries(entries);
          this.selectedBulkCriteriaService.removeSelectedBulkCriterion(entries);
          const uiProfileId = this.selectedBulkCriteriaService.getUiProfileId();
          const criterion = this.createBulkCriterionService.createBulkCriterion(
            entries,
            uiProfileId
          );
          this.feasibilityQueryProviderHub.addCriteriaToStage([criterion]);
          this.feasibilityQueryProviderHub.addCriteriaToCriterionProvider([criterion]);
          return entries;
        })
      )
      .subscribe();
  }

  public navigateToEditor(): void {
    this.navigationHelperService.navigateToFeasibilityQueryEditor();
  }
}
