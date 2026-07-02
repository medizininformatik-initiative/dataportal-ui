import { BehaviorSubject, Observable } from 'rxjs'
import { CRTDLData } from 'src/app/model/Interface/CRTDLData'
import { Injectable } from '@angular/core'
import { ProfileUpgrade } from 'src/app/model/Upgrade/ProfileUpgrade'
import { UpgradeData } from 'src/app/core/model/Upgrade/UpgradeData'
import { ValidationIssueData } from 'src/app/core/model/Validation/ValidationIssueData'
import { ValidationReport } from 'src/app/model/Validation/ValidationReport'

@Injectable({
  providedIn: 'root',
})
export class ErrorLogProviderService {
  private readonly validationResult$ = new BehaviorSubject<ValidationReport | null>(null)
  private readonly validationResultData$ = new BehaviorSubject<ValidationIssueData[] | null>(null)
  private readonly profileUpgrade$ = new BehaviorSubject<ProfileUpgrade[] | null>(null)
  private readonly upgradeData$ = new BehaviorSubject<UpgradeData | null>(null)

  private validatedCRTDLData$: BehaviorSubject<CRTDLData | null> =
    new BehaviorSubject<CRTDLData | null>(null)

  public setValidationResult(result: ValidationReport): void {
    this.validationResult$.next(result)
  }

  public getValidationResult$(): Observable<ValidationReport | null> {
    return this.validationResult$.asObservable()
  }

  public getCurrentValidationResult(): ValidationReport | null {
    return this.validationResult$.value
  }

  public clearValidationResult(): void {
    this.validationResult$.next(null)
  }

  public setValidationResponseData(data: ValidationIssueData[]): void {
    this.validationResultData$.next(data)
  }

  public updateValidationResponseData(data: ValidationIssueData[]): void {
    const result = this.validationResultData$.value
      ? [...this.validationResultData$.value, ...data]
      : data
    this.validationResultData$.next(result)
  }

  public getValidationResponseData$(): Observable<ValidationIssueData[] | null> {
    return this.validationResultData$.asObservable()
  }

  public getCurrentValidationResponseData(): ValidationIssueData[] | null {
    return this.validationResultData$.value
  }

  public clearValidationResponseData(): void {
    this.validationResultData$.next(null)
  }

  public setValidatedCRTDL(crtdl: CRTDLData): void {
    this.validatedCRTDLData$.next(crtdl)
  }

  public getValidatedCRTDL$(): Observable<CRTDLData | null> {
    return this.validatedCRTDLData$.asObservable()
  }

  public getCurrentValidatedCRTDL(): CRTDLData | null {
    return this.validatedCRTDLData$.value
  }

  public setUpgradeData(data: UpgradeData): void {
    this.upgradeData$.next(data)
  }

  public getUpgradeData$(): Observable<UpgradeData | null> {
    return this.upgradeData$.asObservable()
  }

  public getCurrentUpgradeData(): UpgradeData | null {
    return this.upgradeData$.value
  }

  public clearUpgradeData(): void {
    this.upgradeData$.next(null)
  }

  public setProfileUpgrade(profileUpgrade: ProfileUpgrade[]): void {
    this.profileUpgrade$.next(profileUpgrade)
  }

  public getProfileUpgrade$(): Observable<ProfileUpgrade[] | null> {
    return this.profileUpgrade$.asObservable()
  }

  public getCurrentProfileUpgrade(): ProfileUpgrade[] | null {
    return this.profileUpgrade$.value
  }

  public clearProfileUpgrade(): void {
    this.profileUpgrade$.next(null)
  }
}
