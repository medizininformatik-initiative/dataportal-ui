import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { Component, OnInit, input, output } from '@angular/core'
import { TimeRestrictionType } from 'src/app/model/FeasibilityQuery/TimeRestriction'
import { TimeRestrictionNotSet } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/TimeRestrictionNotSet'
import { TimerestrictionTypeSelectorComponent } from './timerestriction-type-selector/timerestriction-type-selector.component'
import { BetweenFilterComponent } from './between-filter/between-filter.component'
import { BeforeFilterComponent } from './before-filter/before-filter.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-edit-time-restriction',
  templateUrl: './edit-time-restriction.component.html',
  styleUrls: ['./edit-time-restriction.component.scss'],
  standalone: true,
  imports: [
    TimerestrictionTypeSelectorComponent,
    BetweenFilterComponent,
    BeforeFilterComponent,
    TranslateModule,
  ],
})
export class EditTimeRestrictionComponent implements OnInit {
  readonly timeRestriction = input<AbstractTimeRestriction>()

  readonly timeRestrictionChanged = output<AbstractTimeRestriction>()

  selectedTimeRestrictionType: TimeRestrictionType

  ngOnInit() {
    if (this.timeRestriction()) {
      this.selectedTimeRestrictionType = this.timeRestriction().getType()
    }
  }

  public onTimeRestrictionOptionChange(timeRestriction: string) {
    this.selectedTimeRestrictionType =
      TimeRestrictionType[timeRestriction as keyof typeof TimeRestrictionType]

    if (this.selectedTimeRestrictionType === TimeRestrictionType.NONE) {
      this.timeRestrictionChanged.emit(new TimeRestrictionNotSet())
    }
  }

  public emitSelectedTimeRestrictionInstance(timeRestrictionInstance: AbstractTimeRestriction) {
    return this.timeRestrictionChanged.emit(timeRestrictionInstance)
  }
}
