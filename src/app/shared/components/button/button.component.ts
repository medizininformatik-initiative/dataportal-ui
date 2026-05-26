import { Component, Input } from '@angular/core'
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

  @Input() icon?: string
  @Input() type?: 'blue' | 'green' | 'red' = 'blue'
  @Input() isDisabled?: boolean
  @Input() tooltip?: string
}
