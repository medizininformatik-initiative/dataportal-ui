import { Component, OnInit } from '@angular/core';
import { CreateCriterionService } from 'src/app/service/Criterion/CreateCriterionService';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { FeasibilityQueryProviderHub } from 'src/app/service/Provider/FeasibilityQueryProviderHub';
import { FeasibilityQueryProviderService } from '../../../../../../service/Provider/FeasibilityQueryProvider.service';
import { FeasibilityQueryValidation } from 'src/app/service/Criterion/FeasibilityQueryValidation.service';
import { map, Observable, of } from 'rxjs';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { SelectedTableItemsService } from 'src/app/service/SearchTermListItemService.service';
import { StageProviderService } from 'src/app/service/Provider/StageProvider.service';
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry';
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service';

@Component({
  selector: 'num-search-action-bar',
  templateUrl: './search-action-bar.component.html',
  styleUrls: ['./search-action-bar.component.scss'],
})
export class SearchActionBarComponent implements OnInit {
  listItemArray$: Observable<CriteriaListEntry[]> = of([]);
  isFeasibilityExistent$: Observable<boolean>;
  stageArray$: Observable<Array<string>> = of([]);

  constructor(
    private listItemSelectionService: SelectedTableItemsService<CriteriaListEntry>,
    private criterionService: CreateCriterionService,
    private stageProviderService: StageProviderService,
    private navigationHelperService: NavigationHelperService,
    private listItemService: SelectedTableItemsService<CriteriaListEntry>,
    private feasibilityQueryProviderHub: FeasibilityQueryProviderHub,
    private feasibilityQueryValidation: FeasibilityQueryValidation,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.listItemArray$ = this.listItemSelectionService.getSelectedTableItems();
    this.stageArray$ = this.stageProviderService.getStageUIDArray();
    this.isFeasibilityExistent$ = this.feasibilityQueryValidation.getIsFeasibilityQuerySet();
  }

  public addItemsToStage() {
    const ids = this.listItemService.getSelectedIds();
    this.criterionService
      .createCriteriaFromHashes(ids)
      .pipe(
        map((criteria: Criterion[]) => {
          this.feasibilityQueryProviderHub.addCriteriaToCriterionProvider(criteria);
          this.feasibilityQueryProviderHub.addCriteriaToStage(criteria);
          return criteria;
        })
      )
      .subscribe((criteria: Criterion[]) => {
        this.snackbarService.displayInfoMessage('FEASIBILITY.SEARCH.SNACKBAR.ADDED_TO_COHORT');
        this.listItemService.clearSelection();
      });
  }

  public navigateToEditor() {
    this.navigationHelperService.navigateToFeasibilityQueryEditor();
  }
}
