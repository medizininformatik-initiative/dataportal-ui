import { Component, OnInit } from '@angular/core';
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service';
import { FeasibilityQueryValidationService } from 'src/app/service/FeasibilityQuery/FeasibilityQueryValidation.service';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { filter, Observable } from 'rxjs';
import { ResultProviderService } from 'src/app/service/Provider/ResultProvider.service';

@Component({
  selector: 'num-cohort-definition',
  templateUrl: './cohort-definition.component.html',
  styleUrls: ['./cohort-definition.component.scss'],
})
export class CohortDefinitionComponent implements OnInit {
  fileName: string;
  isFeasibilityExistent$: Observable<boolean>;
  totalNumberOfPatients: number;

  constructor(
    private routerHelperService: NavigationHelperService,
    private feasibilityQueryService: FeasibilityQueryProviderService,
    private feasibilityQueryValidation: FeasibilityQueryValidationService,
    private resultProviderService: ResultProviderService,
    private navigationHelperService: NavigationHelperService
  ) {}

  ngOnInit() {
    this.feasibilityQueryService
      .getActiveFeasibilityQuery()
      .pipe(filter((feasibilityQuery) => !!feasibilityQuery))
      .subscribe((feasibilityQuery) => {
        const resultIdsLength = feasibilityQuery.getResultIds().length;
        if (resultIdsLength === 0) {
          return;
        } else {
          this.totalNumberOfPatients = this.resultProviderService
            .getOne(feasibilityQuery.getResultIds()[resultIdsLength - 1])
            ?.getTotalNumberOfPatients();
        }
      });
    this.isFeasibilityExistent$ = this.feasibilityQueryValidation.getIsFeasibilityQuerySet();
  }

  public sendQuery() {
    this.routerHelperService.navigateToFeasibilityQueryResult();
  }

  public navigatToDataQueryDataSelection() {
    this.navigationHelperService.navigateToDataQueryDataSelection();
  }
}
