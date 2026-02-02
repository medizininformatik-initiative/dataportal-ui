import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsentService } from '../../../../service/Consent/Consent.service';
import { DataQueryStorageService } from 'src/app/service/DataQuery/DataQueryStorage.service';
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { first, Observable, Subscription } from 'rxjs';
import { InterfaceSavedQueryTile } from 'src/app/shared/models/SavedQueryTile/InterfaceSavedQueryTile';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { QueryResult } from 'src/app/model/Result/QueryResult';
import { ResultProviderService } from 'src/app/service/Provider/ResultProvider.service';
import { SavedDataQuery } from 'src/app/model/SavedDataQuery/SavedDataQuery';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'num-feasibility',
  templateUrl: './feasibility.component.html',
  styleUrls: ['./feasibility.component.scss'],
})
export class FeasibilityComponent implements OnInit, OnDestroy {
  savedQueries$: Observable<InterfaceSavedQueryTile[]>;
  loadSubscription: Subscription;
  loadValidationReportSubscription: Subscription;
  constructor(
    private dataQueryStorageService: DataQueryStorageService,
    private navigationHelperService: NavigationHelperService,
    private resultProviderService: ResultProviderService,
    private consentService: ConsentService
  ) {}

  ngOnInit() {
    this.loadSavedQueries();
  }

  ngOnDestroy() {
    this.loadSubscription?.unsubscribe();
    this.loadValidationReportSubscription?.unsubscribe();
  }

  private loadSavedQueries() {
    this.savedQueries$ = this.dataQueryStorageService.readDataQueries();
  }

  public deleteSavedFeasibility(id: string) {
    this.dataQueryStorageService
      .deleteDataQueryById(Number(id))
      .pipe(first())
      .subscribe(() => {
        this.loadSavedQueries();
      });
  }

  public loadValidationReport(id: string) {
    this.loadValidationReportSubscription?.unsubscribe();
    this.loadValidationReportSubscription = this.dataQueryStorageService
      .getValidationReportForDataquery(Number(id))
      .pipe(take(1))
      .subscribe();
  }

  public loadQueryIntoEditor(id: string) {
    this.consentService.clearConsent();
    this.loadSubscription = this.dataQueryStorageService
      .readDataQueryById(Number(id))
      .pipe(
        map((savedQuery: SavedDataQuery) => {
          const feasibilityQuery = this.extractFeasibilityQuery(savedQuery);
          const queryResult = this.createQueryResult(feasibilityQuery, savedQuery);
          feasibilityQuery.setResultIds([queryResult.getId()]);
          return queryResult;
        }),
        tap((queryResult) => {
          this.resultProviderService.setResultByID(queryResult, queryResult.getId());
        })
      )
      .subscribe(() => this.navigate());
  }

  private extractFeasibilityQuery(savedQuery: SavedDataQuery): FeasibilityQuery {
    return savedQuery.getCrtdl().getFeasibilityQuery();
  }

  private createQueryResult(
    feasibilityQuery: FeasibilityQuery,
    savedQuery: SavedDataQuery
  ): QueryResult {
    return new QueryResult(
      false,
      feasibilityQuery.getId(),
      savedQuery.getTotalNumberOfPatients(),
      uuidv4()
    );
  }

  private navigate(): void {
    this.navigationHelperService.navigateToDataQueryCohortDefinition();
  }
}
