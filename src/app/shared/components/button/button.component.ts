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
  readonly type = input<'blue' | 'green' | 'red' | 'cancel'>('blue')
  readonly isDisabled = input<boolean>(false)
  /** secondary action: border and label only, so each action bar has one filled primary */
  readonly outline = input<boolean>(false)
  readonly tooltip = input<string>(undefined)
  readonly ariaLabel = input<string>()
}
