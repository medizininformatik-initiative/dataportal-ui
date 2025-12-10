import { Component, OnInit } from '@angular/core';
import { FeasibilityQueryFactoryService } from 'src/app/service/FeasibilityQueryFactory.service';
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service';
import { FeasibilityQueryValidationService } from 'src/app/service/Criterion/FeasibilityQueryValidation.service';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { Observable, Subscription } from 'rxjs';
import { ResultProviderService } from 'src/app/service/Provider/ResultProvider.service';

@Component({
  selector: 'num-cohort-definition-action-bar',
  templateUrl: './cohort-definition-action-bar.component.html',
  styleUrls: ['./cohort-definition-action-bar.component.scss'],
})
export class CohortDefinitionActionBarComponent implements OnInit {
  fileName: string;
  isFeasibilityInclusionSet: Observable<boolean>;
  isFeasibilityExistent: Observable<boolean>;
  isFeasibilityQueryValid: Observable<boolean>;
  totalNumberOfPatients: number;
  downloadSubscription: Subscription;

  constructor(
    private routerHelperService: NavigationHelperService,
    private feasibilityQueryService: FeasibilityQueryProviderService,
    private resultProviderService: ResultProviderService,
    private navigationHelperService: NavigationHelperService,
    private feasibilityQueryFactoryService: FeasibilityQueryFactoryService,
    private feasibilityQueryValidation: FeasibilityQueryValidationService
  ) {}

  ngOnInit() {
    this.feasibilityQueryService.getActiveFeasibilityQuery().subscribe((feasibilityQuery) => {
      const resultIdsLength = feasibilityQuery.getResultIds().length;
      this.totalNumberOfPatients = this.resultProviderService
        .getResultByID(feasibilityQuery.getResultIds()[resultIdsLength - 1])
        ?.getTotalNumberOfPatients();
    });

    this.isFeasibilityInclusionSet = this.feasibilityQueryValidation.getIsInclusionSet();
    this.isFeasibilityExistent = this.feasibilityQueryValidation.getIsFeasibilityQuerySet();
    this.isFeasibilityQueryValid = this.feasibilityQueryValidation.getIsFeasibilityQueryValid();
  }

  public sendQuery(): void {
    this.routerHelperService.navigateToFeasibilityQueryResult();
  }

  public createNewCohort(): void {
    this.feasibilityQueryFactoryService.instantiate();
    this.routerHelperService.navigateToFeasibilityQuerySearch();
  }

  public navigatToDataQueryDataSelection(): void {
    this.navigationHelperService.navigateToDataQueryDataSelection();
  }
}
