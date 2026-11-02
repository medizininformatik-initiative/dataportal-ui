import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { UpgradeData } from 'src/app/core/model/Upgrade/UpgradeData'
import { ValidationIssueData } from 'src/app/core/model/Validation/ValidationIssueData'
import { CRTDLData } from 'src/app/model/Interface/CRTDLData'
import { ProfileUpgrade } from 'src/app/model/Upgrade/ProfileUpgrade'
import { ValidationReport } from 'src/app/model/Validation/ValidationReport'

@Injectable({
  providedIn: 'root',
})
export class ErrorLogProviderService {
  private readonly validationResult$ = new BehaviorSubject<ValidationReport | null>(null)
  private readonly validationResultData$ = new BehaviorSubject<ValidationIssueData[] | null>(null)
  private readonly profileUpgrade$ = new BehaviorSubject<ProfileUpgrade[] | null>(null)
  private readonly upgradeData$ = new BehaviorSubject<UpgradeData | null>(null)

  private readonly validatedCRTDLData$: BehaviorSubject<CRTDLData | null> = new BehaviorSubject<CRTDLData | null>(null)

  /**
   * Sets the validation report.
   * @param {ValidationReport} result
   */
  public setValidationResult(result: ValidationReport): void {
    this.validationResult$.next(result)
  }

  /**
   * Returns the validation report as an observable.
   * @returns {Observable<ValidationReport | null>}
   */
  public getValidationResult$(): Observable<ValidationReport | null> {
    return this.validationResult$.asObservable()
  }

  /**
   * Returns the current validation report.
   * @returns {ValidationReport | null}
   */
  public getCurrentValidationResult(): ValidationReport | null {
    return this.validationResult$.value
  }

  /**
   * Clears the validation report.
   */
  public clearValidationResult(): void {
    this.validationResult$.next(null)
  }

  /**
   * Sets the validation response data.
   * @param {ValidationIssueData[]} data
   */
  public setValidationResponseData(data: ValidationIssueData[]): void {
    this.validationResultData$.next(data)
  }

  /**
   * Appends the data to the validation response data.
   * @param {ValidationIssueData[]} data
   */
  public updateValidationResponseData(data: ValidationIssueData[]): void {
    const result = this.validationResultData$.value ? [...this.validationResultData$.value, ...data] : data
    this.validationResultData$.next(result)
  }

  /**
   * Returns the validation response data as an observable.
   * @returns {Observable<ValidationIssueData[] | null>}
   */
  public getValidationResponseData$(): Observable<ValidationIssueData[] | null> {
    return this.validationResultData$.asObservable()
  }

  /**
   * Returns the current validation response data.
   * @returns {ValidationIssueData[] | null}
   */
  public getCurrentValidationResponseData(): ValidationIssueData[] | null {
    return this.validationResultData$.value
  }

  /**
   * Clears the validation response data.
   */
  public clearValidationResponseData(): void {
    this.validationResultData$.next(null)
  }

  /**
   * Sets the validated CRTDL.
   * @param {CRTDLData} crtdl
   */
  public setValidatedCRTDL(crtdl: CRTDLData): void {
    this.validatedCRTDLData$.next(crtdl)
  }

  /**
   * Returns the validated CRTDL as an observable.
   * @returns {Observable<CRTDLData | null>}
   */
  public getValidatedCRTDL$(): Observable<CRTDLData | null> {
    return this.validatedCRTDLData$.asObservable()
  }

  /**
   * Returns the current validated CRTDL.
   * @returns {CRTDLData | null}
   */
  public getCurrentValidatedCRTDL(): CRTDLData | null {
    return this.validatedCRTDLData$.value
  }

  /**
   * Sets the upgrade data.
   * @param {UpgradeData} data
   */
  public setUpgradeData(data: UpgradeData): void {
    this.upgradeData$.next(data)
  }

  /**
   * Returns the upgrade data as an observable.
   * @returns {Observable<UpgradeData | null>}
   */
  public getUpgradeData$(): Observable<UpgradeData | null> {
    return this.upgradeData$.asObservable()
  }

  /**
   * Returns the current upgrade data.
   * @returns {UpgradeData | null}
   */
  public getCurrentUpgradeData(): UpgradeData | null {
    return this.upgradeData$.value
  }

  /**
   * Clears the upgrade data.
   */
  public clearUpgradeData(): void {
    this.upgradeData$.next(null)
  }

  /**
   * Sets the profile upgrades.
   * @param {ProfileUpgrade[]} profileUpgrade
   */
  public setProfileUpgrade(profileUpgrade: ProfileUpgrade[]): void {
    this.profileUpgrade$.next(profileUpgrade)
  }

  /**
   * Returns the profile upgrades as an observable.
   * @returns {Observable<ProfileUpgrade[] | null>}
   */
  public getProfileUpgrade$(): Observable<ProfileUpgrade[] | null> {
    return this.profileUpgrade$.asObservable()
  }

  /**
   * Returns the current profile upgrades.
   * @returns {ProfileUpgrade[] | null}
   */
  public getCurrentProfileUpgrade(): ProfileUpgrade[] | null {
    return this.profileUpgrade$.value
  }

  /**
   * Clears the profile upgrades.
   */
  public clearProfileUpgrade(): void {
    this.profileUpgrade$.next(null)
  }
}
