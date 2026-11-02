import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { DataportalErrorPayloadType } from 'src/app/core/model/DataportalErrorPayloadType'
import { DataportalErrorType } from 'src/app/core/model/DataportalErrorTypes'

@Injectable({
  providedIn: 'root',
})
export class ErrorDisplayService {
  private readonly visibilitySubject = new BehaviorSubject<boolean>(false)
  private readonly errorDataSubject = new BehaviorSubject<DataportalErrorPayloadType | null>(null)
  private readonly errorUrlSubject = new BehaviorSubject<string>('')
  private readonly errorTypeSubject = new BehaviorSubject<string>('')

  public visibility$ = this.visibilitySubject.asObservable()
  public errorData$ = this.errorDataSubject.asObservable()
  public errorUrl$ = this.errorUrlSubject.asObservable()
  public errorType$ = this.errorTypeSubject.asObservable()

  /**
   * Shows the error with its type and url.
   * @param {DataportalErrorPayloadType} errorData
   * @param {DataportalErrorType} errorType
   * @param {string} url
   */
  public showError(errorData: DataportalErrorPayloadType, errorType: DataportalErrorType, url: string) {
    this.errorDataSubject.next(errorData)
    this.errorTypeSubject.next(errorType)
    this.errorUrlSubject.next(url)
    this.visibilitySubject.next(true)
  }

  /**
   * Hides the error.
   */
  public hideError() {
    this.visibilitySubject.next(false)
  }

  /**
   * Clears the error data, type and url.
   */
  public clearError() {
    this.errorDataSubject.next(null)
    this.errorTypeSubject.next('')
    this.errorUrlSubject.next('')
    this.visibilitySubject.next(false)
  }
}
