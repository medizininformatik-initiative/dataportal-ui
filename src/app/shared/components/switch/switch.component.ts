import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'
import { NgClass } from '@angular/common'

@Component({
  selector: 'num-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class SwitchComponent implements OnInit {
  @Input()
  isChecked = true

  @Output()
  toggled: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor() {}

  ngOnInit(): void {}

  public toggleSwitch(event: Event): void {
    const input = event.target as HTMLInputElement
    this.isChecked = input.checked

    this.toggled.emit(this.isChecked)
  }
}
