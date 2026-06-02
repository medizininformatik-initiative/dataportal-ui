import { Component, input } from '@angular/core'

@Component({
  selector: 'num-info-tooltip-card',
  templateUrl: './info-tooltip.component.html',
  styleUrls: ['./info-tooltip.component.scss'],
  standalone: true,
})
export class InfoTooltipComponent {
  readonly title = input<string>()
  readonly text = input<string>()
}
