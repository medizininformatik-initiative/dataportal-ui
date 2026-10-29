import { AsyncPipe } from '@angular/common'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { first, Observable, Subscription } from 'rxjs'
import { map, switchMap, take, tap } from 'rxjs/operators'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { QueryResult } from 'src/app/model/Result/QueryResult'
import { SavedDataQuery } from 'src/app/model/SavedDataQuery/SavedDataQuery'
import { DataQueryStorageService } from 'src/app/service/DataQuery/DataQueryStorage.service'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { ResultProviderService } from 'src/app/service/Provider/ResultProvider.service'
import { InterfaceSavedQueryTile } from 'src/app/shared/models/SavedQueryTile/InterfaceSavedQueryTile'
import { v4 as uuidv4 } from 'uuid'
import { ConsentService } from '../../../../service/Consent/Consent.service'
import { SavedQueryTileComponent } from '../../../../shared/components/saved-query-tile/saved-query-tile.component'

@Component({
  selector: 'num-feasibility',
  templateUrl: './feasibility.component.html',
  styleUrls: ['./feasibility.component.scss'],
  standalone: true,
  imports: [SavedQueryTileComponent, AsyncPipe],
})
export class FeasibilityComponent implements OnInit, OnDestroy {
  private readonly dataQueryStorageService = inject(DataQueryStorageService)
  private readonly navigationHelperService = inject(NavigationHelperService)
  private readonly resultProviderService = inject(ResultProviderService)
  private readonly consentService = inject(ConsentService)

  public savedQueries$: Observable<InterfaceSavedQueryTile[]>
  public loadSubscription: Subscription
  public loadValidationReportSubscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {}

  public ngOnInit() {
    this.loadSavedQueries()
  }

  public ngOnDestroy() {
    this.loadSubscription?.unsubscribe()
    this.loadValidationReportSubscription?.unsubscribe()
  }

  private loadSavedQueries() {
    this.savedQueries$ = this.dataQueryStorageService.readDataQueries()
  }

  public deleteSavedFeasibility(id: string) {
    this.dataQueryStorageService
      .deleteDataQueryById(Number(id))
      .pipe(first())
      .subscribe(() => {
        this.loadSavedQueries()
      })
  }

  public loadValidationReport(id: string) {
    this.loadValidationReportSubscription?.unsubscribe()
    this.loadValidationReportSubscription = this.dataQueryStorageService
      .getValidationReportForDataquery(Number(id))
      .pipe(take(1))
      .subscribe()
  }

  public loadQueryIntoEditor(id: string) {
    this.consentService.clearConsent()
    this.loadSubscription = this.dataQueryStorageService
      .readDataQueryById(Number(id))
      .pipe(
        map((savedQuery: SavedDataQuery) => {
          const feasibilityQuery = this.extractFeasibilityQuery(savedQuery)
          const queryResult = this.createQueryResult(feasibilityQuery, savedQuery)
          feasibilityQuery.setResultIds([queryResult.getId()])
          return queryResult
        }),
        tap((queryResult: QueryResult) => {
          this.resultProviderService.setOne(queryResult)
        })
      )
      .subscribe(() => this.navigate())
  }

  private extractFeasibilityQuery(savedQuery: SavedDataQuery): FeasibilityQuery {
    return savedQuery.getCrtdl().getFeasibilityQuery()
  }

  private createQueryResult(feasibilityQuery: FeasibilityQuery, savedQuery: SavedDataQuery): QueryResult {
    return new QueryResult(false, feasibilityQuery.getId(), savedQuery.getTotalNumberOfPatients(), uuidv4())
  }

  private navigate(): void {
    this.navigationHelperService.navigateToDataQueryCohortDefinition()
  }
}
