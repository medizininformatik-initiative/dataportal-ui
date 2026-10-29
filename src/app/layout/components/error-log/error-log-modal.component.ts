import { AsyncPipe } from '@angular/common'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { TranslateModule } from '@ngx-translate/core'
import { Observable, Subject, tap } from 'rxjs'
import { ProfileUpgrade } from 'src/app/model/Upgrade/ProfileUpgrade'
import { ValidationIssue } from 'src/app/model/Validation/ValidationIssue'
import { ValidationReport } from 'src/app/model/Validation/ValidationReport'
import { ErrorLogProviderService } from 'src/app/service/Validation/External/ErrorLogProvider.service'
import { ModalWindowComponent } from '../../../shared/components/modal-window/modal-window.component'
import { ErrorLogActionsComponent } from './error-log-actions/error-log-actions.component'
import { ErrorLogHeaderComponent } from './error-log-header/error-log-header.component'
import { ErrorLogItemComponent } from './error-log-item/error-log-item.component'

@Component({
  selector: 'num-error-log-modal',
  templateUrl: './error-log-modal.component.html',
  styleUrls: ['./error-log-modal.component.scss'],
  standalone: true,
  imports: [ModalWindowComponent, ErrorLogHeaderComponent, ErrorLogItemComponent, ErrorLogActionsComponent, AsyncPipe, TranslateModule],
})
export class ErrorLogModalComponent implements OnInit, OnDestroy {
  public data = inject<ValidationReport>(MAT_DIALOG_DATA)
  private readonly errorLogProvider = inject(ErrorLogProviderService)

  public validationReport: ValidationReport | null = null
  public errors: ValidationIssue[] = []

  public upgrades$: Observable<ProfileUpgrade[] | null>
  private readonly destroy$ = new Subject<void>()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}
  public ngOnInit(): void {
    this.validationReport = this.data
    if (this.data instanceof ValidationReport) {
      this.errors = this.data?.getIssues() || []
    }
    this.upgrades$ = this.errorLogProvider.getProfileUpgrade$()
  }

  public ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
