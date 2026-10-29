import { Component, effect, model, signal } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { TimeRestrictionNotSet } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/TimeRestrictionNotSet'
import { TimeRestrictionType } from 'src/app/model/FeasibilityQuery/TimeRestriction'
import { SectionNameComponent } from 'src/app/shared/components/section-name/section-name.component'
import { BeforeFilterComponent } from './before-filter/before-filter.component'
import { BetweenFilterComponent } from './between-filter/between-filter.component'
import { TimerestrictionTypeSelectorComponent } from './timerestriction-type-selector/timerestriction-type-selector.component'

@Component({
  selector: 'num-edit-time-restriction',
  templateUrl: './edit-time-restriction.component.html',
  styleUrls: ['./edit-time-restriction.component.scss'],
  standalone: true,
  imports: [TimerestrictionTypeSelectorComponent, BetweenFilterComponent, BeforeFilterComponent, TranslateModule, SectionNameComponent],
})
export class EditTimeRestrictionComponent {
  public readonly timeRestriction = model<AbstractTimeRestriction>()

  public readonly selectedTimeRestrictionType = signal<TimeRestrictionType | undefined>(undefined)

  constructor() {
    effect(() => {
      const type = this.timeRestriction()?.getType()
      if (type !== undefined) {
        this.selectedTimeRestrictionType.set(type)
      }
    })
  }

  public onTimeRestrictionOptionChange(timeRestriction: string) {
    const type = TimeRestrictionType[timeRestriction as keyof typeof TimeRestrictionType]
    this.selectedTimeRestrictionType.set(type)

    if (type === TimeRestrictionType.NONE) {
      this.timeRestriction.set(new TimeRestrictionNotSet())
    }
  }

  public emitSelectedTimeRestrictionInstance(timeRestrictionInstance: AbstractTimeRestriction) {
    this.timeRestriction.set(timeRestrictionInstance)
  }
}
