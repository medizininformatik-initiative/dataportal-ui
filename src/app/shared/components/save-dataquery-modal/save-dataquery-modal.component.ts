import { ButtonComponent } from '../button/button.component'
import { Component, inject, OnDestroy, OnInit, output } from '@angular/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { FormsModule } from '@angular/forms'
import { HeaderComponent } from '../header/header.component'
import { MatDialogRef } from '@angular/material/dialog'
import { SaveDataModal } from '../../models/SaveDataModal/SaveDataModal'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-save-dataquery-modal',
  templateUrl: './save-dataquery-modal.component.html',
  styleUrls: ['./save-dataquery-modal.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, HeaderComponent, FormsModule, ButtonComponent, TranslateModule],
})
export class SaveDataQueryModalComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<SaveDataQueryModalComponent>>(MatDialogRef)

  readonly save = output<SaveDataModal>()

  readonly cancelled = output<void>()

  title = ''
  comment = ''

  constructor() {}

  ngOnInit(): void {}

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
