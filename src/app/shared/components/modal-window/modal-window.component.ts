import { Component, EventEmitter, Output, Input } from '@angular/core'
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
  @Input()
  disabled = false

  @Input()
  displaySaveButtons = true

  @Output()
  cancelButtonSelected = new EventEmitter()

  @Output()
  saveButtonSelected = new EventEmitter()

  public save() {
    this.saveButtonSelected.emit()
  }

  cancel() {
    this.cancelButtonSelected.emit()
  }
}
