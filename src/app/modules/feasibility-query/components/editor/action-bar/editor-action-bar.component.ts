import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataQueryValidationService } from 'src/app/service/DataQuery/DataQueryValidation.service';
import { FeasibilityQueryValidation } from 'src/app/service/Criterion/FeasibilityQueryValidation.service';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { Observable, of, Subscription } from 'rxjs';
import { SaveDataQueryModalService } from 'src/app/service/SaveDataQueryModal.service';
import { StageProviderService } from '../../../../../service/Provider/StageProvider.service';
import { ValidDataQuery } from 'src/app/model/Types/ValidDataQuery';

@Component({
  selector: 'num-editor-action-bar',
  templateUrl: './editor-action-bar.component.html',
  styleUrls: ['./editor-action-bar.component.scss'],
})
export class EditorActionBarComponent implements OnInit, OnDestroy {
  stageArray$: Observable<Array<string>> = of([]);
  isFeasibilityQueryValid$: Observable<boolean>;

  validDataQuery$: Observable<ValidDataQuery>;

  saveDataQueryModalSubscription: Subscription;

  constructor(
    private dataQueryValidation: DataQueryValidationService,
    private feasibilityQueryValidation: FeasibilityQueryValidation,
    private stageProviderService: StageProviderService,
    private navigationHelperService: NavigationHelperService,
    private saveDataQueryModalService: SaveDataQueryModalService
  ) {}

  ngOnInit() {
    this.isFeasibilityQueryValid$ = this.feasibilityQueryValidation.getIsFeasibilityQueryValid();
    this.stageArray$ = this.stageProviderService.getStageUIDArray();
    this.validDataQuery$ = this.dataQueryValidation.validateDataQuery();
  }

  ngOnDestroy() {
    this.saveDataQueryModalSubscription?.unsubscribe();
  }

  public saveDataQuery() {
    this.saveDataQueryModalSubscription?.unsubscribe();
    this.saveDataQueryModalSubscription = this.saveDataQueryModalService
      .openSaveDataQueryModal()
      .subscribe();
  }

  public navigateToSearch() {
    this.navigationHelperService.navigateToFeasibilityQuerySearch();
  }

  public doSendRequest(): void {
    this.navigationHelperService.navigateToFeasibilityQueryResult();
  }

  public navigateToDataRequestCohortDefinition(): void {
    this.navigationHelperService.navigateToDataQueryCohortDefinition();
  }

  public navigateToBulkCriteriaSearch(): void {
    this.navigationHelperService.navigateToFeasibilityQueryBulkSearch();
  }
}
