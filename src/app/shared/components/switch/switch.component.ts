import { Component, OnInit, model, output } from '@angular/core'
import { NgClass } from '@angular/common'

@Component({
  selector: 'num-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class SwitchComponent implements OnInit {
  readonly isChecked = model(true)

  readonly toggled = output<boolean>()

  constructor() {}

  ngOnInit(): void {}

  public toggleSwitch(event: Event): void {
    const input = event.target as HTMLInputElement
    this.isChecked.set(input.checked)

    this.toggled.emit(this.isChecked())
  }
}
