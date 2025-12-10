import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { DataSelectionFactoryService } from 'src/app/service/DataSelection/DataSelection.factory.service';
import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service';
import { FeasibilityQueryValidationService } from 'src/app/service/Criterion/FeasibilityQueryValidation.service';
import { map } from 'rxjs/operators';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'num-data-selection-action-bar',
  templateUrl: './data-selection-action-bar.component.html',
  styleUrls: ['./data-selection-action-bar.component.scss'],
})
export class DataSelectionActionBarComponent implements OnDestroy, OnInit {
  isDataSelectionExistent$: Observable<boolean>;
  isCohortExistent$: Observable<boolean>;
  fileName: string;
  private subscription: Subscription;

  downloadSubscription: Subscription;

  mainProfileSubscription: Subscription;

  constructor(
    public elementRef: ElementRef,
    private dataSelectionProviderService: DataSelectionProviderService,
    private navigationHelperService: NavigationHelperService,
    private feasibilityQueryValidation: FeasibilityQueryValidationService,
    private dataSelectionFactoryService: DataSelectionFactoryService
  ) {}

  ngOnInit(): void {
    this.isDataSelectionExistent$ = this.dataSelectionProviderService
      .getActiveDataSelection()
      .pipe(map((dataSelection) => dataSelection.getProfiles().length > 0));

    this.isCohortExistent$ = this.feasibilityQueryValidation.getIsFeasibilityQueryValid();
  }

  ngOnDestroy(): void {
    this.mainProfileSubscription?.unsubscribe();
    this.subscription?.unsubscribe();
  }

  public createNewDataSelection() {
    this.mainProfileSubscription?.unsubscribe();
    this.dataSelectionFactoryService.instantiate().subscribe();
    this.navigationHelperService.navigateToDataSelectionSearch();
  }

  public navigateToDataQueryCohortDefinition() {
    this.navigationHelperService.navigateToDataQueryCohortDefinition();
  }
}
