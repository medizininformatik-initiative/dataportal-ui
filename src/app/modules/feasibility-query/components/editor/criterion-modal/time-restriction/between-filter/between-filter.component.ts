import { BetweenFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/BetweenFilter'
import { TimeRestrictionFactoryService } from 'src/app/service/Factory/TimeRestrictionFactory.service'
import { TimeRestrictionType } from 'src/app/model/FeasibilityQuery/TimeRestriction'
import { Component, OnInit, inject, input, output } from '@angular/core'
import { DatePickerComponent } from '../../../../../../../shared/components/date-picker/date-picker.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-between-filter',
  templateUrl: './between-filter.component.html',
  styleUrls: ['./between-filter.component.scss'],
  standalone: true,
  imports: [DatePickerComponent, TranslateModule],
})
export class BetweenFilterComponent implements OnInit {
  private timeRestrictionFactoryService = inject(TimeRestrictionFactoryService)

  readonly betweenFilter = input<BetweenFilter>(undefined)

  readonly betweenFilterChanged = output<BetweenFilter>()

  beforeDate: string

  afterDate: string

  displayDateWarning = false

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit(): void {
    this.initializeDates()
    this.emitInstance()
  }

  private initializeDates(): void {
    this.beforeDate = this.betweenFilter().getBeforeDate()
    this.afterDate = this.betweenFilter().getAfterDate()
  }

  public onBeforeDateChange(selectedDate: string) {
    this.beforeDate = selectedDate
    this.emitInstance()
  }

  public onAfterDateChange(selectedDate: string) {
    this.afterDate = selectedDate
    this.emitInstance()
  }

  public emitInstance() {
    if (this.beforeDate && this.afterDate) {
      if (new Date(this.beforeDate).getTime() > new Date(this.afterDate).getTime()) {
        const timeRestrictionFilter =
          this.timeRestrictionFactoryService.createTimeRestrictionFilter(
            TimeRestrictionType.BETWEEN,
            this.afterDate,
            this.beforeDate
          ) as BetweenFilter
        this.betweenFilterChanged.emit(timeRestrictionFilter)
        this.displayDateWarning = false
      } else {
        this.displayDateWarning = true
      }
    }
  }
}
