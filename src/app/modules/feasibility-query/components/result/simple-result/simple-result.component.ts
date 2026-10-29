import { AsyncPipe } from '@angular/common'
import { Component, OnDestroy, OnInit, inject, output } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'
import { filter, Observable, pairwise, Subject, Subscription } from 'rxjs'
import { ErrorQueryResult } from 'src/app/model/Result/ErrorQueryResult'
import { QueryResult } from 'src/app/model/Result/QueryResult'
import { QueryResultRateLimit } from 'src/app/model/Result/QueryResultRateLimit'
import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service'
import { FeasibilityQuery } from '../../../../../model/FeasibilityQuery/FeasibilityQuery'
import { FeasibilityQueryResultService } from '../../../../../service/FeasibilityQuery/Result/FeasibilityQueryResult.service'
import { FeasibilityQueryProviderService } from '../../../../../service/Provider/FeasibilityQueryProvider.service'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { SpinnerComponent } from '../../../../../shared/components/spinner/spinner.component'
import { PatientCountComponent } from '../patient-count/patient-count.component'
import { ResultDetailModalComponent, ResultDetailsModalComponentData } from '../result-detail-modal/result-detail-modal.component'

type QueryResponseType = QueryResult | ErrorQueryResult | null

@Component({
  selector: 'num-simple-result',
  templateUrl: './simple-result.component.html',
  styleUrls: ['./simple-result.component.scss'],
  standalone: true,
  imports: [PatientCountComponent, ButtonComponent, MatTooltip, SpinnerComponent, AsyncPipe, TranslateModule],
})
export class SimpleResultComponent implements OnInit, OnDestroy {
  public dialog = inject(MatDialog)
  private readonly feasibilityQueryResultService = inject(FeasibilityQueryResultService)
  private readonly queryProviderService = inject(FeasibilityQueryProviderService)
  private readonly appSettingsProviderService = inject(AppSettingsProviderService)
  private readonly snackbarService = inject(SnackbarService)

  public showSpinner = false

  public pollingTime: number
  public patientCountArray: string[] = []

  public isQueryExpired = false
  private timeoutId: ReturnType<typeof setTimeout> | null = null
  private expTime: number

  public queryResultRateLimit$: Observable<QueryResultRateLimit>
  public loadedResult = false

  public activeFeasibilityQuerySusbscription: Subscription

  public doSendSusbscription: Subscription

  public modalSubscription: Subscription

  public totalNumberOfPatients: number

  public readonly resultLoaded = output<boolean>()

  public feasibilityQuery: FeasibilityQuery

  constructor() {
    this.queryResultRateLimit$ = this.feasibilityQueryResultService.getDetailedResultRateLimit()
    this.pollingTime = this.appSettingsProviderService.getPollingTimeUi()
  }

  private readonly destroy$ = new Subject<void>()

  public ngOnInit(): void {
    this.activeFeasibilityQuerySusbscription?.unsubscribe()
    this.activeFeasibilityQuerySusbscription = this.queryProviderService
      .getActiveFeasibilityQuery()
      .pipe(filter((feasibilityQuery: FeasibilityQuery) => feasibilityQuery.getInclusionCriteria().length > 0))
      .subscribe({
        next: () => this.doSend(),
        error: (err) => console.error('Error fetching feasibility query', err),
      })
  }

  public ngOnDestroy(): void {
    this.activeFeasibilityQuerySusbscription?.unsubscribe()
    this.doSendSusbscription?.unsubscribe()
    this.modalSubscription?.unsubscribe()
    this.destroy$.next()
    this.destroy$.complete()
  }

  private doSend(): void {
    this.initializeState()
    this.doSendSusbscription?.unsubscribe()

    const expirationTime = this.appSettingsProviderService.getQueryResultExpiry()
    this.startExpirationTimer(expirationTime * 1000)
    const obs = this.feasibilityQueryResultService.doSendQueryRequest()

    this.doSendSusbscription = this.createDoSendSubscription(obs)
  }

  /**
   * Handles the subscription logic separately.
   * @param {Observable<QueryResponseType>} obs
   * @returns {Subscription}
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
   * @param {QueryResponseType} prev
   * @param {QueryResponseType} current
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
   * @param {QueryResponseType} prev
   * @param {QueryResponseType} current
   * @returns {boolean}
   */
  private shouldFinalize(prev: QueryResponseType, current: QueryResponseType): boolean {
    return this.isQueryResult(prev) && current === null
  }

  /**
   * Checks if we should handle an error result.
   * @param {QueryResponseType} prev
   * @param {QueryResponseType} current
   * @returns {boolean}
   */
  private shouldHandleError(prev: QueryResponseType, current: QueryResponseType): boolean {
    return !this.isQueryResult(prev) && current === null
  }

  /**
   * Checks if we should handle a valid query result.
   * @param {QueryResponseType} current
   * @returns {boolean}
   */
  private shouldHandleValidResult(current: QueryResponseType): boolean {
    return this.isQueryResult(current)
  }

  /**
   * Type guard to check if an object is a QueryResult.
   * @param {QueryResponseType} result
   * @returns {result is QueryResult}
   */
  private isQueryResult(result: QueryResponseType): result is QueryResult {
    return result?.getTotalNumberOfPatients() !== null
  }

  /**
   * Handles errors in the query request.
   * @param {any} error
   */
  private handleQueryError(error: any): void {
    console.error('Error fetching query result', error)
    this.showSpinner = false
  }

  public openDialogResultDetails(): void {
    this.modalSubscription?.unsubscribe()
    const dialogConfig = new MatDialogConfig<ResultDetailsModalComponentData>()
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true
    const modal = this.dialog.open(ResultDetailModalComponent, dialogConfig)
    this.modalSubscription = modal.afterClosed().subscribe(() => this.feasibilityQueryResultService.refreshResultRateLimit())
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
   * @param {number} totalNumberOfPatients
   */
  private setPatientCount(totalNumberOfPatients: number): void {
    const patientCountArray = totalNumberOfPatients?.toString()?.split('')
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
