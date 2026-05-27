import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { FormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-value-select',
  templateUrl: './value-select.component.html',
  styleUrls: ['./value-select.component.scss'],
  standalone: true,
  imports: [MatFormField, MatLabel, MatInput, FormsModule, TranslateModule],
})
export class ValueSelectComponent {
  @Input()
  value: number

  @Input()
  label: string

  @Output()
  selectedValue: EventEmitter<number> = new EventEmitter<number>()

  public emitValue() {
    setTimeout(() => {
      this.selectedValue.emit(this.value)
    }, 1000)
  }
}
