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
  readonly tabbable = input(true)
  readonly label = input<string>()
  readonly checkedChange = output<boolean>()
}
