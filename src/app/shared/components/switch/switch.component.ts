import { NgClass } from '@angular/common'
import { Component, OnInit, model, output } from '@angular/core'

@Component({
  selector: 'num-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class SwitchComponent implements OnInit {
  public readonly isChecked = model(true)

  public readonly toggled = output<boolean>()

  constructor() {}

  public ngOnInit(): void {}

  public toggleSwitch(event: Event): void {
    const input = event.target as HTMLInputElement
    this.isChecked.set(input.checked)

    this.toggled.emit(this.isChecked())
  }
}
