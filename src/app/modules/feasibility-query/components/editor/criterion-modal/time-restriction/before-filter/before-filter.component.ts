import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core'
import { TimeRestrictionFactoryService } from 'src/app/service/Factory/TimeRestrictionFactory.service'
import { TimeRestrictionType } from 'src/app/model/FeasibilityQuery/TimeRestriction'
import { DatePickerComponent } from '../../../../../../../shared/components/date-picker/date-picker.component'

@Component({
  selector: 'num-before-filter',
  templateUrl: './before-filter.component.html',
  styleUrls: ['./before-filter.component.scss'],
  standalone: true,
  imports: [DatePickerComponent],
})
export class BeforeFilterComponent implements OnInit, OnChanges {
  private timeRestrictionFactoryService = inject(TimeRestrictionFactoryService)

  @Input()
  timeRestrictionType: TimeRestrictionType

  @Input()
  selectedDate = ''

  @Output()
  timeRestrictionInstanceChanged = new EventEmitter<AbstractTimeRestriction>()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.timeRestrictionType) {
      this.timeRestrictionType = changes.timeRestrictionType.currentValue
      this.emitSelectedTimeRestriction()
    }
  }

  public setSelectedDate(selectedDate: string) {
    this.selectedDate = selectedDate
    this.emitSelectedTimeRestriction()
  }

  public emitSelectedTimeRestriction() {
    if (this.selectedDate) {
      const timeRestrictionFilter = this.timeRestrictionFactoryService.createTimeRestrictionFilter(
        this.timeRestrictionType,
        this.selectedDate
      )
      this.timeRestrictionInstanceChanged.emit(timeRestrictionFilter)
    }
  }
}
