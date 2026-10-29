import { NgClass } from '@angular/common'
import { Component, OnInit, input, output } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-bool-logic-switch',
  templateUrl: './bool-logic-switch.component.html',
  styleUrls: ['./bool-logic-switch.component.scss'],
  standalone: true,
  imports: [NgClass, TranslateModule],
})
export class BoolLogicSwitchComponent implements OnInit {
  public readonly switched = output<string>()

  public readonly label = input<'AND' | 'OR'>('AND')

  public readonly position = input<'inner' | 'outer'>('outer')

  constructor() {}

  public ngOnInit(): void {}

  public getLabelKey(): string {
    return 'FEASIBILITY.EDITOR.SWITCH.LABEL_' + this.label()
  }

  public switch(): void {
    this.switched.emit(this.position())
  }
}
