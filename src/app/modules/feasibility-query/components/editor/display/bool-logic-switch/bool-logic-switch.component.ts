import { Component, OnInit, input, output } from '@angular/core'
import { NgClass } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-bool-logic-switch',
  templateUrl: './bool-logic-switch.component.html',
  styleUrls: ['./bool-logic-switch.component.scss'],
  standalone: true,
  imports: [NgClass, TranslateModule],
})
export class BoolLogicSwitchComponent implements OnInit {
  readonly switched = output<string>()

  readonly label = input<'AND' | 'OR'>('AND')

  readonly position = input<'inner' | 'outer'>('outer')

  constructor() {}

  ngOnInit(): void {}

  getLabelKey(): string {
    return 'FEASIBILITY.EDITOR.SWITCH.LABEL_' + this.label()
  }

  switch(): void {
    this.switched.emit(this.position())
  }
}
