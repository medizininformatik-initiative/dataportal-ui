import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { ErrorLogProviderService } from 'src/app/service/Validation/ErrorLogProvider.service'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Observable, Subject, tap } from 'rxjs'
import { ValidationIssue } from 'src/app/model/Validation/ValidationIssue'
import { ValidationReport } from 'src/app/model/Validation/ValidationReport'
import { ProfileUpgrade } from 'src/app/model/Upgrade/ProfileUpgrade'
import { ModalWindowComponent } from '../../../shared/components/modal-window/modal-window.component'
import { ErrorLogHeaderComponent } from './error-log-header/error-log-header.component'
import { ErrorLogItemComponent } from './error-log-item/error-log-item.component'
import { ErrorLogActionsComponent } from './error-log-actions/error-log-actions.component'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-error-log-modal',
  templateUrl: './error-log-modal.component.html',
  styleUrls: ['./error-log-modal.component.scss'],
  standalone: true,
  imports: [
    ModalWindowComponent,
    ErrorLogHeaderComponent,
    ErrorLogItemComponent,
    ErrorLogActionsComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class ErrorLogModalComponent implements OnInit, OnDestroy {
  validationReport: ValidationReport | null = null
  errors: ValidationIssue[] = []

  upgrades$: Observable<ProfileUpgrade[] | null>
  private destroy$ = new Subject<void>()

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ValidationReport,
    private errorLogProvider: ErrorLogProviderService
  ) {}
  ngOnInit(): void {
    this.validationReport = this.data
    if (this.data instanceof ValidationReport) {
      this.errors = this.data?.getIssues() || []
    }
    this.upgrades$ = this.errorLogProvider.getProfileUpgrade$()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
