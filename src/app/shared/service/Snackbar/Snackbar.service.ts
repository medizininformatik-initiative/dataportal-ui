import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

export enum ErrorCodes {
  FEAS_10001 = 'FEAS-10001',
  FEAS_10002 = 'FEAS-10002',
  FEAS_10003 = 'FEAS-10003',
  FEAS_10004 = 'FEAS-10004',
  FEAS_10005 = 'FEAS-10005',
  FEAS_10006 = 'FEAS-10006',
  VAL_20001 = 'VAL-20001',
  SITE_NOT_FOUND = '404',
}

export enum MessageType {
  ERROR = 'ERROR',
  INFO = 'INFO',
}

export enum SnackbarColor {
  ERROR = 'red',
  INFO = 'green',
}
@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly visibilitySubject = new Subject<boolean>()
  public visibility$ = this.visibilitySubject.asObservable()

  private readonly messageSubject = new Subject<string>()
  public message$ = this.messageSubject.asObservable()

  private readonly colorSubject = new Subject<string>()
  public color$ = this.colorSubject.asObservable()

  constructor() {}

  /**
   * Displays the error message.
   * @todo implement timer for retry after
   * @param {string} errorCode
   */
  public displayErrorMessage(errorCode: string): void {
    const message = `${MessageType.ERROR}.${errorCode}`
    // if (retryAfter > 0) {
    //   message += `${retryAfter}`;
    //   this.setSnackbarTimeOut(retryAfter * 1000);
    // }
    this.activateSnackbar(message, SnackbarColor.ERROR)
  }

  /**
   * Displays an error message as given, without an error code lookup.
   * @param {string} message
   */
  public displayErrorMessageWithNoCode(message: string): void {
    this.activateSnackbar(message, SnackbarColor.ERROR)
  }

  /**
   * Displays an info message.
   * @param {string} infoMessage
   */
  public displayInfoMessage(infoMessage: string): void {
    this.activateSnackbar(infoMessage, SnackbarColor.INFO)
  }

  /**
   * Shows the snackbar with the given message and color, then hides it after 5 seconds.
   * @param {string} message
   * @param {string} color
   */
  public activateSnackbar(message: string, color: string): void {
    this.visibilitySubject.next(true)
    this.messageSubject.next(message)
    this.colorSubject.next(color)
    setTimeout(() => this.deactivateSnackbar(), 5000)
  }

  /**
   * Hides the snackbar after the given time.
   * @param {number} timeout
   */
  private setSnackbarTimeOut(timeout: number = 5000): void {
    setTimeout(() => this.deactivateSnackbar(), timeout)
  }

  /**
   * Hides the snackbar.
   */
  public deactivateSnackbar(): void {
    this.visibilitySubject.next(false)
  }
}
