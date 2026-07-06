import { Component, model, input, output } from '@angular/core'
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
  readonly value = model<number>()

  readonly label = input<string>(undefined)

  readonly selectedValue = output<number>()

  public onChange(val: number): void {
    this.value.set(val)
    this.emitValue()
  }

  public emitValue(): void {
    const v = this.value()
    setTimeout(() => {
      this.selectedValue.emit(v)
    }, 300)
  }
}
