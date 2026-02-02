import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataportalErrorPayloadType } from 'src/app/core/model/DataportalErrorPayloadType';
import { DataportalErrorType } from 'src/app/core/model/DataportalErrorTypes';

@Injectable({
  providedIn: 'root',
})
export class ErrorDisplayService {
  private visibilitySubject = new BehaviorSubject<boolean>(false);
  private errorDataSubject = new BehaviorSubject<DataportalErrorPayloadType | null>(null);
  private errorUrlSubject = new BehaviorSubject<string>('');
  private errorTypeSubject = new BehaviorSubject<string>('');

  public visibility$ = this.visibilitySubject.asObservable();
  public errorData$ = this.errorDataSubject.asObservable();
  public errorUrl$ = this.errorUrlSubject.asObservable();
  public errorType$ = this.errorTypeSubject.asObservable();

  public showError(
    errorData: DataportalErrorPayloadType,
    errorType: DataportalErrorType,
    url: string
  ) {
    this.errorDataSubject.next(errorData);
    this.errorTypeSubject.next(errorType);
    this.errorUrlSubject.next(url);
    this.visibilitySubject.next(true);
  }

  public hideError() {
    this.visibilitySubject.next(false);
  }

  public clearError() {
    this.errorDataSubject.next(null);
    this.errorTypeSubject.next('');
    this.errorUrlSubject.next('');
    this.visibilitySubject.next(false);
  }
}
