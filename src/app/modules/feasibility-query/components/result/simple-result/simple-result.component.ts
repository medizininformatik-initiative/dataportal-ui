import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core'
import { FeasibilityQuery } from '../../../../../model/FeasibilityQuery/FeasibilityQuery'
import { FeasibilityQueryProviderService } from '../../../../../service/Provider/FeasibilityQueryProvider.service'
import { FeasibilityQueryResultService } from '../../../../../service/FeasibilityQuery/Result/FeasibilityQueryResult.service'
import { filter, Observable, pairwise, Subject, Subscription } from 'rxjs'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { QueryResult } from 'src/app/model/Result/QueryResult'
import { QueryResultRateLimit } from 'src/app/model/Result/QueryResultRateLimit'
import {
  ResultDetailModalComponent,
  ResultDetailsModalComponentData,
} from '../result-detail-modal/result-detail-modal.component'
import { ErrorQueryResult } from 'src/app/model/Result/ErrorQueryResult'
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service'
import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { PatientCountComponent } from '../patient-count/patient-count.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { MatTooltip } from '@angular/material/tooltip'
import { SpinnerComponent } from '../../../../../shared/components/spinner/spinner.component'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

type QueryResponseType = QueryResult | ErrorQueryResult | null

@Component({
  selector: 'num-simple-result',
  templateUrl: './simple-result.component.html',
  styleUrls: ['./simple-result.component.scss'],
  standalone: true,
  imports: [
    PatientCountComponent,
    ButtonComponent,
    MatTooltip,
    SpinnerComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class SimpleResultComponent implements OnInit, OnDestroy {
  showSpinner = false

  pollingTime: number
  patientCountArray: string[] = []

  public isQueryExpired = false
  private timeoutId: ReturnType<typeof setTimeout> | null = null
  private expTime: number

  queryResultRateLimit$: Observable<QueryResultRateLimit>
  loadedResult = false

  activeFeasibilityQuerySusbscription: Subscription

  doSendSusbscription: Subscription

  modalSubscription: Subscription

  totalNumberOfPatients: number

  @Output()
  resultLoaded: EventEmitter<boolean> = new EventEmitter<boolean>()

  feasibilityQuery: FeasibilityQuery
  constructor(
    public dialog: MatDialog,
    private feasibilityQueryResultService: FeasibilityQueryResultService,
    private queryProviderService: FeasibilityQueryProviderService,
    private appSettingsProviderService: AppSettingsProviderService,
    private snackbarService: SnackbarService
  ) {
    this.queryResultRateLimit$ = this.feasibilityQueryResultService.getDetailedResultRateLimit()
    this.pollingTime = this.appSettingsProviderService.getPollingTimeUi()
  }

  private destroy$ = new Subject<void>()

  ngOnInit(): void {
    this.activeFeasibilityQuerySusbscription?.unsubscribe()
    this.activeFeasibilityQuerySusbscription = this.queryProviderService
      .getActiveFeasibilityQuery()
      .pipe(filter((feasibilityQuery) => feasibilityQuery.getInclusionCriteria().length > 0))
      .subscribe({
        next: () => this.doSend(),
        error: (err) => console.error('Error fetching feasibility query', err),
      })
  }

  ngOnDestroy(): void {
    this.activeFeasibilityQuerySusbscription?.unsubscribe()
    this.doSendSusbscription?.unsubscribe()
    this.modalSubscription?.unsubscribe()
    this.destroy$.next()
    this.destroy$.complete()
  }

  private doSend(): void {
    this.initializeState()
    this.doSendSusbscription?.unsubscribe()

    this.startExpirationTimer(90 * 1000)
    const obs = this.feasibilityQueryResultService.doSendQueryRequest()

    this.doSendSusbscription = this.createDoSendSubscription(obs)
  }

  /**
   * Handles the subscription logic separately.
   */
  private createDoSendSubscription(obs: Observable<QueryResponseType>): Subscription {
    return obs.pipe(pairwise()).subscribe({
      next: ([prev, current]) => this.handleQueryResults(prev, current),
      error: (error) => this.handleQueryError(error),
      complete: () => this.finalize(),
    })
  }

  /**
   * Handles the logic for processing the query results.
   */
  private handleQueryResults(prev: QueryResponseType, current: QueryResponseType): void {
    if (this.shouldFinalize(prev, current)) {
      this.finalize()
      this.handleResult(prev as QueryResult)
    } else if (this.shouldHandleError(prev, current)) {
      console.error('Received an error result:', prev)
      this.snackbarService.displayErrorMessage(prev?.getIssues()?.[0]?.getCode())
      this.showSpinner = false
    } else if (this.shouldHandleValidResult(current)) {
      this.handleResult(current as QueryResult)
    }
  }

  /**
   * Checks if we should finalize the process.
   */
  private shouldFinalize(prev: QueryResponseType, current: QueryResponseType): boolean {
    return this.isQueryResult(prev) && current === null
  }

  /**
   * Checks if we should handle an error result.
   */
  private shouldHandleError(prev: QueryResponseType, current: QueryResponseType): boolean {
    return !this.isQueryResult(prev) && current === null
  }

  /**
   * Checks if we should handle a valid query result.
   */
  private shouldHandleValidResult(current: QueryResponseType): boolean {
    return this.isQueryResult(current)
  }

  /**
   * Type guard to check if an object is a QueryResult.
   */
  private isQueryResult(result: QueryResponseType): result is QueryResult {
    return result?.getTotalNumberOfPatients() !== null
  }

  /**
   * Handles errors in the query request.
   */
  private handleQueryError(error: any): void {
    console.error('Error fetching query result', error)
    this.showSpinner = false
  }

  openDialogResultDetails(): void {
    this.modalSubscription?.unsubscribe()
    const dialogConfig = new MatDialogConfig<ResultDetailsModalComponentData>()
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true
    const modal = this.dialog.open(ResultDetailModalComponent, dialogConfig)
    this.modalSubscription = modal
      .afterClosed()
      .subscribe(() => this.feasibilityQueryResultService.refreshResultRateLimit())
  }

  private initializeState(): void {
    this.loadedResult = false
    this.showSpinner = true
    this.expTime = this.appSettingsProviderService.getQueryResultExpiry()
  }

  private handleResult(result: QueryResult): void {
    this.totalNumberOfPatients = result.getTotalNumberOfPatients()
    this.setPatientCount(result.getTotalNumberOfPatients())
    this.resultLoaded.emit(this.loadedResult)
  }

  /**
   * If the result array has fewer than 10 digits, pad it with leading '0' digits until its length is 10
   */
  private setPatientCount(totalNumberOfPatients: number): void {
    const patientCountArray = totalNumberOfPatients.toString().split('')
    const lengthOfDigitFields = 8
    while (patientCountArray.length < lengthOfDigitFields) {
      patientCountArray.unshift('0')
    }
    this.patientCountArray = patientCountArray
  }

  private finalize(): void {
    this.loadedResult = true
    this.showSpinner = false
  }

  private startExpirationTimer(durationMs: number) {
    this.timeoutId = setTimeout(() => {
      this.isQueryExpired = true
    }, durationMs)
  }
}
