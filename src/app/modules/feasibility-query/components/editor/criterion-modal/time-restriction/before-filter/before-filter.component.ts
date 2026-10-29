import { Component, effect, inject, input, model, output, untracked } from '@angular/core'
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { TimeRestrictionType } from 'src/app/model/FeasibilityQuery/TimeRestriction'
import { TimeRestrictionFactoryService } from 'src/app/service/Factory/TimeRestrictionFactory.service'
import { DatePickerComponent } from '../../../../../../../shared/components/date-picker/date-picker.component'

@Component({
  selector: 'num-before-filter',
  templateUrl: './before-filter.component.html',
  styleUrls: ['./before-filter.component.scss'],
  standalone: true,
  imports: [DatePickerComponent],
})
export class BeforeFilterComponent {
  private readonly timeRestrictionFactoryService = inject(TimeRestrictionFactoryService)

  public readonly timeRestrictionType = input<TimeRestrictionType>()

  public readonly selectedDate = model('')

  public readonly timeRestrictionInstanceChanged = output<AbstractTimeRestriction>()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    effect(() => {
      this.timeRestrictionType() // track changes
      untracked(() => this.emitSelectedTimeRestriction())
    })
  }

  public setSelectedDate(selectedDate: string) {
    this.selectedDate.set(selectedDate)
    this.emitSelectedTimeRestriction()
  }

  public emitSelectedTimeRestriction() {
    const date = this.selectedDate()
    const type = this.timeRestrictionType()
    if (date) {
      const timeRestrictionFilter = this.timeRestrictionFactoryService.createTimeRestrictionFilter(type, date)
      this.timeRestrictionInstanceChanged.emit(timeRestrictionFilter)
    }
  }
}
