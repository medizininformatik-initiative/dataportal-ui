import { AvailabilityStatusType } from 'src/app/model/Availability/AvailabilityStatusType';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  STATUS_CONFIG,
  StatusConfig,
} from 'src/app/shared/models/AvailabilityStatus/AvailabilityStatus';

@Component({
  selector: 'num-availability-status-bar',
  templateUrl: './availability-status-bar.component.html',
  styleUrls: ['./availability-status-bar.component.scss'],
})
export class AvailabilityStatusBarComponent implements OnChanges, OnInit {
  @Input() status: AvailabilityStatusType = 'unknown';

  animatedPercentage = 0;

  get config(): StatusConfig {
    return STATUS_CONFIG[this.status];
  }

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.status) {
      setTimeout(() => {
        this.animatedPercentage = STATUS_CONFIG[this.status].percentage;
      }, 50);
    }
  }
}
