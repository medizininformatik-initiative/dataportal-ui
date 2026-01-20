import { BehaviorSubject, Observable } from 'rxjs';
import { ErrorLog } from 'src/app/model/Validation/ErrorLog';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorLogProviderService {
  private readonly validationResult$ = new BehaviorSubject<ErrorLog | null>(null);

  public setValidationResult(result: ErrorLog): void {
    this.validationResult$.next(result);
  }

  public getValidationResult$(): Observable<ErrorLog | null> {
    return this.validationResult$.asObservable();
  }

  public getCurrentValidationResult(): ErrorLog | null {
    return this.validationResult$.value;
  }

  public clearValidationResult(): void {
    this.validationResult$.next(null);
  }
}
