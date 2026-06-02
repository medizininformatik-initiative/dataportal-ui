import { Component, model, output } from '@angular/core'
import { MatInput } from '@angular/material/input'
import {
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepickerToggleIcon,
  MatDatepicker,
} from '@angular/material/datepicker'
import { FormsModule } from '@angular/forms'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

@Component({
  selector: 'num-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  standalone: true,
  imports: [
    MatInput,
    MatDatepickerInput,
    FormsModule,
    MatDatepickerToggle,
    FontAwesomeModule,
    MatDatepickerToggleIcon,
    MatDatepicker,
  ],
})
export class DatePickerComponent {
  readonly dateChanged = output<string>()

  readonly selectedDate = model('')

  public emitSelectedDate(): void {
    this.dateChanged.emit(this.selectedDate())
  }
}
