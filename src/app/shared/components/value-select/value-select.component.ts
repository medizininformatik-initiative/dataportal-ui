import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'num-value-select',
  templateUrl: './value-select.component.html',
  styleUrls: ['./value-select.component.scss'],
})
export class ValueSelectComponent {
  @Input()
  value: number;

  @Input()
  label: string;

  @Output()
  selectedValue: EventEmitter<number> = new EventEmitter<number>();

  public emitValue() {
    setTimeout(() => {
      this.selectedValue.emit(this.value);
    }, 1000);
  }
}
