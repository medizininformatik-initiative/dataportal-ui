import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataQueryValidationService } from 'src/app/service/DataQuery/DataQueryValidation.service';
import { FeasibilityQueryValidationService } from 'src/app/service/Criterion/FeasibilityQueryValidation.service';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { Observable, of, Subscription } from 'rxjs';
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
    private feasibilityQueryValidation: FeasibilityQueryValidationService,
    private stageProviderService: StageProviderService,
    private navigationHelperService: NavigationHelperService
  ) {}

  ngOnInit() {
    this.isFeasibilityQueryValid$ = this.feasibilityQueryValidation.getIsFeasibilityQueryValid();
    this.validDataQuery$ = this.dataQueryValidation.validateDataQuery();
  }

  ngOnDestroy() {
    this.saveDataQueryModalSubscription?.unsubscribe();
  }

  public navigateToSearch() {
    this.navigationHelperService.navigateToFeasibilityQuerySearch();
  }

  public doSendRequest(): void {
    this.navigationHelperService.navigateToFeasibilityQueryResult();
  }

  public navigateToBulkCriteriaSearch(): void {
    this.navigationHelperService.navigateToFeasibilityQueryBulkSearch();
  }
}
