import { Component, input, output } from '@angular/core'
import { SaveFileDataModal } from '../../models/SaveDataModal/SaveFileDataModal'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { FormsModule } from '@angular/forms'
import { ButtonComponent } from '../button/button.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-save-file-modal',
  templateUrl: './save-file-modal.component.html',
  styleUrls: ['./save-file-modal.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, ButtonComponent, TranslateModule],
})
export class SaveFileModalComponent {
  readonly isCommentRequired = input(false)

  readonly save = output<SaveFileDataModal>()

  readonly cancelled = output<void>()

  title = ''

  doSave(): void {
    this.save.emit({
      title: this.title,
    })
  }

  doDiscard(): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.cancelled.emit()
  }
}
