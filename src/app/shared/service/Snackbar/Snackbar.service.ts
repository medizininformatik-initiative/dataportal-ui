import { Injectable, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
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
  private translate = inject(TranslateService)
  private visibilitySubject = new Subject<boolean>()
  public visibility$ = this.visibilitySubject.asObservable()

  private messageSubject = new Subject<string>()
  public message$ = this.messageSubject.asObservable()

  private colorSubject = new Subject<string>()
  public color$ = this.colorSubject.asObservable()

  constructor() {}

  /**
   * @todo implement timer for retry after
   * @param errorCode
   * @param retryAfter
   */
  public displayErrorMessage(errorCode: string, retryAfter: number = 0) {
    let message = `${MessageType.ERROR}.${errorCode}`
    if (retryAfter > 0) {
      message =
        this.translate.instant(message) +
        ' ' +
        this.translate.instant('FEASIBILITY.EDITOR.ACTION_BAR.RETRY_AFTER', { seconds: retryAfter })
    }
    this.activateSnackbar(message, SnackbarColor.ERROR)
  }

  public displayErrorMessageWithNoCode(message: string) {
    this.activateSnackbar(message, SnackbarColor.ERROR)
  }

  public displayInfoMessage(infoMessage: string) {
    this.activateSnackbar(infoMessage, SnackbarColor.INFO)
  }

  public activateSnackbar(message: string, color: string) {
    this.visibilitySubject.next(true)
    this.messageSubject.next(message)
    this.colorSubject.next(color)
    setTimeout(() => this.deactivateSnackbar(), 5000)
  }

  private setSnackbarTimeOut(timeout: number = 5000) {
    setTimeout(() => this.deactivateSnackbar(), timeout)
  }

  public deactivateSnackbar() {
    this.visibilitySubject.next(false)
  }
}
