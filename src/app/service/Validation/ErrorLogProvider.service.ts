import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ValidationReport } from 'src/app/model/Validation/ValidationReport';
import { ValidationResponseData } from 'src/app/core/model/Validation/ValidationResponseData';
import { CRTDLData } from 'src/app/model/Interface/CRTDLData';

@Injectable({
  providedIn: 'root',
})
export class ErrorLogProviderService {
  private readonly validationResult$ = new BehaviorSubject<ValidationResponseData[] | null>(null);
  private readonly validationResultData$ = new BehaviorSubject<ValidationResponseData | null>(null);
  private validatedCRTDLData$: BehaviorSubject<CRTDLData | null> =
    new BehaviorSubject<CRTDLData | null>(null);

  public setValidationResult(result: ValidationResponseData[]): void {
    this.validationResult$.next(result);
  }

  public getValidationResult$(): Observable<ValidationResponseData[] | null> {
    return this.validationResult$.asObservable();
  }

  public getCurrentValidationResult(): ValidationResponseData[] | null {
    return this.validationResult$.value;
  }

  public clearValidationResult(): void {
    this.validationResult$.next(null);
  }

  public setValidationResponseData(data: ValidationResponseData): void {
    console.log('Setting validation response data in ErrorLogProviderService:', data);
    this.validationResultData$.next(data);
  }

  public getValidationResponseData$(): Observable<ValidationResponseData | null> {
    return this.validationResultData$.asObservable();
  }

  public getCurrentValidationResponseData(): ValidationResponseData | null {
    return this.validationResultData$.value;
  }

  public clearValidationResponseData(): void {
    this.validationResultData$.next(null);
  }

  public setValidatedCRTDL(crtdl: CRTDLData): void {
    this.validatedCRTDLData$.next(crtdl);
  }

  public getValidatedCRTDL$(): Observable<CRTDLData | null> {
    return this.validatedCRTDLData$.asObservable();
  }

  public getCurrentValidatedCRTDL(): CRTDLData | null {
    return this.validatedCRTDLData$.value;
  }
}
