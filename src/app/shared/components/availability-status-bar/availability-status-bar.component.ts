import { AvailabilityStatusType } from 'src/app/model/Availability/AvailabilityStatusType'
import { Component, computed, effect, input, signal } from '@angular/core'
import { STATUS_CONFIG } from 'src/app/shared/models/AvailabilityStatus/AvailabilityStatus'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-availability-status-bar',
  templateUrl: './availability-status-bar.component.html',
  styleUrls: ['./availability-status-bar.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class AvailabilityStatusBarComponent {
  readonly status = input<AvailabilityStatusType>('UNKNOWN')

  readonly animatedPercentage = signal(0)

  readonly config = computed(() => STATUS_CONFIG[this.status()])

  constructor() {
    effect(() => {
      const percentage = this.config().percentage

      setTimeout(() => {
        this.animatedPercentage.set(percentage)
      }, 50)
    })
  }
}
