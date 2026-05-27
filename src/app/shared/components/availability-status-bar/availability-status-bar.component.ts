import { AvailabilityStatusType } from 'src/app/model/Availability/AvailabilityStatusType'
import { Component, OnChanges, OnInit, SimpleChanges, input } from '@angular/core'
import {
  STATUS_CONFIG,
  StatusConfig,
} from 'src/app/shared/models/AvailabilityStatus/AvailabilityStatus'

@Component({
  selector: 'num-availability-status-bar',
  templateUrl: './availability-status-bar.component.html',
  styleUrls: ['./availability-status-bar.component.scss'],
  standalone: true,
})
export class AvailabilityStatusBarComponent implements OnChanges, OnInit {
  readonly status = input<AvailabilityStatusType>('unknown')

  animatedPercentage = 0

  get config(): StatusConfig {
    return STATUS_CONFIG[this.status()]
  }

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.status) {
      setTimeout(() => {
        this.animatedPercentage = STATUS_CONFIG[this.status()].percentage
      }, 50)
    }
  }
}
