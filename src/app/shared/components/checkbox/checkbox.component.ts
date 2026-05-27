import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'num-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  standalone: true,
})
export class CheckboxComponent {
  @Input() checked = false
  @Input() disabled = false
  @Output() checkedChange = new EventEmitter<boolean>()

  toggle(event: MouseEvent): void {
    event.stopPropagation()
    if (!this.disabled) {
      this.checkedChange.emit(!this.checked)
    }
  }
}
