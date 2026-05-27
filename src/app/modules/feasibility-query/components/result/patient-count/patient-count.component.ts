import { Component, Input, OnChanges, OnInit } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-patient-count',
  templateUrl: './patient-count.component.html',
  styleUrls: ['./patient-count.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class PatientCountComponent implements OnInit, OnChanges {
  @Input()
  totalNumberOfPatients: number

  patientCountArray: string[] = []

  LENGTH_OF_DIGIT_FIELDS = 8
  constructor() {}

  ngOnInit(): void {
    this.setPatientCountArray()
  }

  ngOnChanges(): void {
    this.setPatientCountArray()
  }

  /**
   * If the result array has fewer than 10 digits, pad it with leading '0' digits until its length is 10
   */
  private setPatientCountArray(): void {
    const patientCountArray = this.totalNumberOfPatients.toString().split('')
    while (patientCountArray.length < this.LENGTH_OF_DIGIT_FIELDS) {
      patientCountArray.unshift('0')
    }
    this.patientCountArray = patientCountArray
  }
}
