import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
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
  @Output()
  switched = new EventEmitter()

  @Input()
  label: 'AND' | 'OR' = 'AND'

  @Input()
  position: 'inner' | 'outer' = 'outer'

  constructor() {}

  ngOnInit(): void {}

  getLabelKey(): string {
    return 'FEASIBILITY.EDITOR.SWITCH.LABEL_' + this.label
  }

  switch(): void {
    this.switched.emit(this.position)
  }
}
