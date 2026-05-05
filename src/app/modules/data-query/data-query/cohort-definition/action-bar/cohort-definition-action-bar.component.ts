import { Component, OnInit } from '@angular/core';
import { FeasibilityQueryFactoryService } from 'src/app/service/FeasibilityQueryFactory.service';
import { FeasibilityQueryValidationService } from 'src/app/service/FeasibilityQuery/FeasibilityQueryValidation.service';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { Observable, Subscription } from 'rxjs';

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
    private navigationHelperService: NavigationHelperService,
    private feasibilityQueryFactoryService: FeasibilityQueryFactoryService,
    private feasibilityQueryValidation: FeasibilityQueryValidationService
  ) {}

  ngOnInit() {
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
