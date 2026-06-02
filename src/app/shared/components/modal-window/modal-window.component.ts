import { Component, input, output } from '@angular/core'
import { ButtonComponent } from '../button/button.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss'],
  standalone: true,
  imports: [ButtonComponent, TranslateModule],
})
export class ModalWindowComponent {
  readonly disabled = input(false)

  readonly displaySaveButtons = input(true)

  readonly cancelButtonSelected = output()

  readonly saveButtonSelected = output()

  public save() {
    this.saveButtonSelected.emit()
  }

  cancel() {
    this.cancelButtonSelected.emit()
  }
}
