import { Component, OnChanges, OnInit, input } from '@angular/core'
import { SectionNameComponent } from '../../../../../shared/components/section-name/section-name.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-patient-count',
  templateUrl: './patient-count.component.html',
  styleUrls: ['./patient-count.component.scss'],
  standalone: true,
  imports: [TranslateModule, SectionNameComponent],
})
export class PatientCountComponent implements OnInit, OnChanges {
  readonly totalNumberOfPatients = input<number>(undefined)

  patientCountArray: string[] = []

  LENGTH_OF_DIGIT_FIELDS = 8
  constructor() {}

  ngOnInit(): void {
    this.setPatientCountArray()
  }

  ngOnChanges(): void {
    this.setPatientCountArray()
  }

  /** Number without padding zeros, for screen readers. */
  get value(): string {
    return String(Number(this.patientCountArray.join('')))
  }

  /** True for the padding zeros in front of the number (the last digit never counts as padding). */
  isLeadingZero(index: number): boolean {
    return (
      index < this.patientCountArray.length - 1 &&
      this.patientCountArray.slice(0, index + 1).every((d) => d === '0')
    )
  }

  /** True for the first digit of each group of three, counted from the right. */
  startsGroup(index: number): boolean {
    return index > 0 && (this.patientCountArray.length - index) % 3 === 0
  }

  /**
   * If the result array has fewer than 10 digits, pad it with leading '0' digits until its length is 10
   */
  private setPatientCountArray(): void {
    const patientCountArray = this.totalNumberOfPatients()
      ? this.totalNumberOfPatients()?.toString()?.split('')
      : ['0']
    while (patientCountArray.length < this.LENGTH_OF_DIGIT_FIELDS) {
      patientCountArray.unshift('0')
    }
    this.patientCountArray = patientCountArray
  }
}
