import { Component, OnDestroy, OnInit, inject, input, output } from '@angular/core'
import { DataQueryValidationService } from '../../../service/DataQuery/DataQueryValidation.service'
import { MatDialogRef } from '@angular/material/dialog'
import { Observable, Subject } from 'rxjs'
import { SaveDataModal } from '../../models/SaveDataModal/SaveDataModal'
import { takeUntil } from 'rxjs/operators'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { HeaderComponent } from '../header/header.component'
import { FormsModule } from '@angular/forms'
import { ButtonComponent } from '../button/button.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-save-dataquery-modal',
  templateUrl: './save-dataquery-modal.component.html',
  styleUrls: ['./save-dataquery-modal.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, HeaderComponent, FormsModule, ButtonComponent, TranslateModule],
})
export class SaveDataQueryModalComponent implements OnInit, OnDestroy {
  private dialogRef = inject<MatDialogRef<SaveDataQueryModalComponent>>(MatDialogRef)
  private dataQueryValidation = inject(DataQueryValidationService)

  validatedDataQuery$: Observable<{ feasibilityQuery: boolean; dataSelection: boolean }>

  readonly save = output<SaveDataModal>()

  readonly cancelled = output<void>()

  title = ''
  comment = ''

  private destroy$ = new Subject<void>()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit(): void {
    this.validatedDataQuery$ = this.dataQueryValidation.validateDataQuery()
    this.validatedDataQuery$.pipe(takeUntil(this.destroy$)).subscribe()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  doSave(): void {
    this.dialogRef.close({
      title: this.title,
      comment: this.comment,
    })
  }

  doDiscard(): void {
    this.dialogRef.close()
  }
}
