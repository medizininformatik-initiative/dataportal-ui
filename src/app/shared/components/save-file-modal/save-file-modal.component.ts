import { Component, input, output } from '@angular/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { FormsModule } from '@angular/forms'
import { SaveDataModal } from '../../models/SaveDataModal/SaveDataModal'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-save-file-modal',
  templateUrl: './save-file-modal.component.html',
  styleUrls: ['./save-file-modal.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, TranslateModule],
})
export class SaveFileModalComponent {
  readonly isCommentRequired = input(false)

  readonly save = output<SaveDataModal>()

  readonly cancelled = output<void>()

  title = ''
  comment = ''

  doSave(): void {
    this.save.emit({
      title: this.title,
      comment: this.comment,
    })
  }

  doDiscard(): void {
    this.cancelled.emit()
  }
}
