import { Component, computed, effect, input, signal } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { AvailabilityStatusType } from 'src/app/model/Availability/AvailabilityStatusType'
import { STATUS_CONFIG } from 'src/app/shared/models/AvailabilityStatus/AvailabilityStatus'

@Component({
  selector: 'num-availability-status-bar',
  templateUrl: './availability-status-bar.component.html',
  styleUrls: ['./availability-status-bar.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class AvailabilityStatusBarComponent {
  public readonly status = input<AvailabilityStatusType>('UNKNOWN')

  public readonly animatedPercentage = signal(0)

  public readonly config = computed(() => STATUS_CONFIG[this.status()])

  constructor() {
    effect(() => {
      const percentage = this.config().percentage

      setTimeout(() => {
        this.animatedPercentage.set(percentage)
      }, 50)
    })
  }
}
