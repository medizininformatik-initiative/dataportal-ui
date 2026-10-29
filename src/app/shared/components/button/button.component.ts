import { NgClass, NgTemplateOutlet } from '@angular/common'
import { Component, input } from '@angular/core'
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

  public readonly icon = input<string>()
  public readonly type = input<'blue' | 'green' | 'red' | 'cancel'>('blue')
  public readonly isDisabled = input<boolean>(false)
  public readonly tooltip = input<string>(undefined)
}
