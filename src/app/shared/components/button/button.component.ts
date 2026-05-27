import { Component, input } from '@angular/core'
import { NgClass, NgTemplateOutlet } from '@angular/common'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

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
  readonly isDisabled = input<boolean>(undefined)
  readonly tooltip = input<string>(undefined)
}
