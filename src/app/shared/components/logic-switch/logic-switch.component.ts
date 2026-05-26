import { Component } from '@angular/core'
import { NgClass } from '@angular/common'
import { SwitchComponent } from '../switch/switch.component'

@Component({
  selector: 'num-logic-switch',
  templateUrl: './logic-switch.component.html',
  styleUrls: ['./logic-switch.component.scss'],
  standalone: true,
  imports: [NgClass, SwitchComponent],
})
export class LogicSwitchComponent {
  isOrSelected = false

  test(event) {
    this.isOrSelected = event
  }
}
