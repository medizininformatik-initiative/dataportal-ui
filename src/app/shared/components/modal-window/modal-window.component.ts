import { Component, input, output } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ButtonComponent } from '../button/button.component'

@Component({
  selector: 'num-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss'],
  standalone: true,
  imports: [ButtonComponent, TranslateModule],
})
export class ModalWindowComponent {
  public readonly disabled = input(false)

  public readonly displaySaveButtons = input(true)

  public readonly cancelButtonSelected = output()

  public readonly saveButtonSelected = output()

  public save() {
    this.saveButtonSelected.emit()
  }

  public cancel() {
    this.cancelButtonSelected.emit()
  }
}
