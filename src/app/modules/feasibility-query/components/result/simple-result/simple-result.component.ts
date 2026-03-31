import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FeasibilityQuery } from '../../../../../model/FeasibilityQuery/FeasibilityQuery';
import { FeasibilityQueryProviderService } from '../../../../../service/Provider/FeasibilityQueryProvider.service';
import { FeasibilityQueryResultService } from '../../../../../service/FeasibilityQuery/Result/FeasibilityQueryResult.service';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  of,
  pairwise,
  Subject,
  Subscription,
  switchMap,
  timer,
} from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { QueryResult } from 'src/app/model/Result/QueryResult';
import { QueryResultRateLimit } from 'src/app/model/Result/QueryResultRateLimit';
import {
  ResultDetailModalComponent,
  ResultDetailsModalComponentData,
} from '../result-detail-modal/result-detail-modal.component';
import { ErrorQueryResult } from 'src/app/model/Result/ErrorQueryResult';
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service';
import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service';

type QueryResponseType = QueryResult | ErrorQueryResult | null;

@Component({
  selector: 'num-simple-result',
  templateUrl: './simple-result.component.html',
  styleUrls: ['./simple-result.component.scss'],
})
export class SimpleResultComponent implements OnInit, OnDestroy {
  showSpinner = false;

  pollingTime: number;
  patientCountArray: string[] = [];
  private isActive = true;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  expTime: number;

  queryResultRateLimit$: Observable<QueryResultRateLimit>;
  private loadedResultSubject = new BehaviorSubject<boolean>(false);
  loadedResult = false;

  activeFeasibilityQuerySusbscription: Subscription;

  doSendSusbscription: Subscription;

  modalSubscription: Subscription;

  isResultButtonDisabled$: Observable<boolean>;

  totalNumberOfPatients: number;

  @Output()
  resultLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  feasibilityQuery: FeasibilityQuery;
  constructor(
    public dialog: MatDialog,
    private feasibilityQueryResultService: FeasibilityQueryResultService,
    private queryProviderService: FeasibilityQueryProviderService,
    private appSettingsProviderService: AppSettingsProviderService,
    private snackbarService: SnackbarService
  ) {
    this.queryResultRateLimit$ = this.feasibilityQueryResultService.getDetailedResultRateLimit();
    this.pollingTime = this.appSettingsProviderService.getPollingTimeUi();
  }

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.activeFeasibilityQuerySusbscription?.unsubscribe();
    this.activeFeasibilityQuerySusbscription = this.queryProviderService
      .getActiveFeasibilityQuery()
      .pipe(filter((feasibilityQuery) => feasibilityQuery.getInclusionCriteria().length > 0))
      .subscribe({
        next: () => this.doSend(),
        error: (err) => console.error('Error fetching feasibility query', err),
      });

    this.isResultButtonDisabled$ = combineLatest([
      this.queryResultRateLimit$,
      this.loadedResultSubject.asObservable(),
      of(this.appSettingsProviderService.getQueryResultExpiryTime()),
    ]).pipe(
      switchMap(([rateLimit, loadedResult, expirySeconds]) => {
        const remaining = rateLimit?.getRemaining?.() ?? 1;
        if (!expirySeconds) {
          return of(!loadedResult || remaining === 0);
        }
        const expiryTimestamp = Date.now() + expirySeconds * 1000;
        return timer(0, 1000).pipe(
          map(() => {
            const isExpired = Date.now() >= expiryTimestamp;
            return !loadedResult || remaining === 0 || isExpired;
          })
        );
      })
    );
  }

  /**
   * Updates the disabled state for the result button.
   */

  ngOnDestroy(): void {
    this.activeFeasibilityQuerySusbscription?.unsubscribe();
    this.doSendSusbscription?.unsubscribe();
    this.modalSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private doSend(): void {
    this.initializeState();
    this.doSendSusbscription?.unsubscribe();

    const obs = this.feasibilityQueryResultService.doSendQueryRequest();

    this.doSendSusbscription = this.createDoSendSubscription(obs);
  }

  /**
   * Handles the subscription logic separately.
   */
  private createDoSendSubscription(obs: Observable<QueryResponseType>): Subscription {
    return obs.pipe(pairwise()).subscribe({
      next: ([prev, current]) => this.handleQueryResults(prev, current),
      error: (error) => this.handleQueryError(error),
      complete: () => this.finalize(),
    });
  }

  /**
   * Handles the logic for processing the query results.
   */
  private handleQueryResults(prev: QueryResponseType, current: QueryResponseType): void {
    if (this.shouldFinalize(prev, current)) {
      this.finalize();
      this.handleResult(prev as QueryResult);
    } else if (this.shouldHandleError(prev, current)) {
      console.error('Received an error result:', prev);
      this.snackbarService.displayErrorMessage(prev?.getIssues()?.[0]?.getCode());
      this.showSpinner = false;
    } else if (this.shouldHandleValidResult(current)) {
      this.handleResult(current as QueryResult);
    }
  }

  /**
   * Checks if we should finalize the process.
   */
  private shouldFinalize(prev: QueryResponseType, current: QueryResponseType): boolean {
    return this.isQueryResult(prev) && current === null;
  }

  /**
   * Checks if we should handle an error result.
   */
  private shouldHandleError(prev: QueryResponseType, current: QueryResponseType): boolean {
    return !this.isQueryResult(prev) && current === null;
  }

  /**
   * Checks if we should handle a valid query result.
   */
  private shouldHandleValidResult(current: QueryResponseType): boolean {
    return this.isQueryResult(current);
  }

  /**
   * Type guard to check if an object is a QueryResult.
   */
  private isQueryResult(result: QueryResponseType): result is QueryResult {
    return result?.getTotalNumberOfPatients() !== null;
  }

  /**
   * Handles errors in the query request.
   */
  private handleQueryError(error: any): void {
    console.error('Error fetching query result', error);
    this.showSpinner = false;
  }

  openDialogResultDetails(): void {
    this.modalSubscription?.unsubscribe();
    const dialogConfig = new MatDialogConfig<ResultDetailsModalComponentData>();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const modal = this.dialog.open(ResultDetailModalComponent, dialogConfig);
    this.modalSubscription = modal
      .afterClosed()
      .subscribe(() => this.feasibilityQueryResultService.refreshResultRateLimit());
  }

  private initializeState(): void {
    this.loadedResult = false;
    this.loadedResultSubject.next(false);
    this.showSpinner = true;
    this.expTime = this.appSettingsProviderService.getQueryResultExpiryTime();
    console.log(this.expTime);
  }

  private handleResult(result: QueryResult): void {
    this.totalNumberOfPatients = result.getTotalNumberOfPatients();
    this.loadedResult = true;
    this.loadedResultSubject.next(true);
    this.resultLoaded.emit(this.loadedResult);
  }

  private finalize(): void {
    this.loadedResult = true;
    this.showSpinner = false;
  }

  start(durationMs: number) {
    this.timeoutId = setTimeout(() => {
      this.isActive = false;
      console.log('Timer abgelaufen → isActive = false');
    }, durationMs);
  }
}
