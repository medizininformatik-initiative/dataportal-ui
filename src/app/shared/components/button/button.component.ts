import { Component, input } from '@angular/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatTooltip } from '@angular/material/tooltip'
import { NgClass, NgTemplateOutlet } from '@angular/common'

@Component({
  selector: 'num-button',
  templateUrl: './button.component.html',
  standalone: true,
  imports: [NgClass, MatTooltip, FontAwesomeModule, NgTemplateOutlet],
})
export class ButtonComponent {
  constructor() {}

  readonly icon = input<string>()
  readonly type = input<'blue' | 'green' | 'red'>('blue')
  readonly isDisabled = input<boolean>(false)
  readonly tooltip = input<string>(undefined)
}
