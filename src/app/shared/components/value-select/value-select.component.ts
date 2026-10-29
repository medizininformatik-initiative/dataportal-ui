import { Component, model, input, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-value-select',
  templateUrl: './value-select.component.html',
  styleUrls: ['./value-select.component.scss'],
  standalone: true,
  imports: [MatFormField, MatLabel, MatInput, FormsModule, TranslateModule],
})
export class ValueSelectComponent {
  public readonly value = model<number>()

  public readonly label = input<string>(undefined)

  public readonly selectedValue = output<number>()

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
