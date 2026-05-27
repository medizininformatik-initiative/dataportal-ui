import { Component, model, output } from '@angular/core'
import { TimeRestrictionType } from 'src/app/model/FeasibilityQuery/TimeRestriction'
import { FormsModule } from '@angular/forms'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-timerestriction-type-selector',
  templateUrl: './timerestriction-type-selector.component.html',
  styleUrls: ['./timerestriction-type-selector.component.scss'],
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, TranslateModule],
})
export class TimerestrictionTypeSelectorComponent {
  readonly type = model<TimeRestrictionType>()

  timeRestrictionOptions: string[] = Object.values(TimeRestrictionType)

  readonly timeRestrictionTypeChanged = output<TimeRestrictionType>()

  public onTimeRestrictionOptionChange(timeRestriction: string) {
    this.type.set(TimeRestrictionType[timeRestriction as keyof typeof TimeRestrictionType])
    this.timeRestrictionTypeChanged.emit(this.type())
  }
}
