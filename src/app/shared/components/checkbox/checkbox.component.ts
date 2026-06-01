import { Component, input, output } from '@angular/core'

@Component({
  selector: 'num-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  standalone: true,
})
export class CheckboxComponent {
  readonly checked = input(false)
  readonly disabled = input(false)
  readonly checkedChange = output<boolean>()

  toggle(event: MouseEvent): void {
    event.stopPropagation()
    if (!this.disabled()) {
      this.checkedChange.emit(!this.checked())
    }
  }
}
