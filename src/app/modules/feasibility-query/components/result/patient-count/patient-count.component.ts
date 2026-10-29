import { Component, OnChanges, OnInit, input } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-patient-count',
  templateUrl: './patient-count.component.html',
  styleUrls: ['./patient-count.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class PatientCountComponent implements OnInit, OnChanges {
  public readonly totalNumberOfPatients = input<number>(undefined)

  public patientCountArray: string[] = []

  public LENGTH_OF_DIGIT_FIELDS = 8
  constructor() {}

  public ngOnInit(): void {
    this.setPatientCountArray()
  }

  public ngOnChanges(): void {
    this.setPatientCountArray()
  }

  /**
   * If the result array has fewer than 10 digits, pad it with leading '0' digits until its length is 10
   */
  private setPatientCountArray(): void {
    const patientCountArray = this.totalNumberOfPatients() ? this.totalNumberOfPatients()?.toString()?.split('') : ['0']
    while (patientCountArray.length < this.LENGTH_OF_DIGIT_FIELDS) {
      patientCountArray.unshift('0')
    }
    this.patientCountArray = patientCountArray
  }
}
