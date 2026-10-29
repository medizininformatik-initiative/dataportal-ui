import { Component, input, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { SaveDataModal } from '../../models/SaveDataModal/SaveDataModal'

@Component({
  selector: 'num-save-file-modal',
  templateUrl: './save-file-modal.component.html',
  styleUrls: ['./save-file-modal.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, TranslateModule],
})
export class SaveFileModalComponent {
  public readonly isCommentRequired = input(false)

  public readonly save = output<SaveDataModal>()

  public readonly cancelled = output<void>()

  public title = ''
  public comment = ''

  public doSave(): void {
    this.save.emit({
      title: this.title,
      comment: this.comment,
    })
  }

  public doDiscard(): void {
    this.cancelled.emit()
  }
}
