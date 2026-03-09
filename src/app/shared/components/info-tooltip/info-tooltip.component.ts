import { Component, Input } from '@angular/core';

@Component({
  selector: 'num-info-tooltip-card',
  templateUrl: './info-tooltip.component.html',
  styleUrls: ['./info-tooltip.component.scss'],
})
export class InfoTooltipComponent {
  @Input() title: string;
  @Input() text: string;
}
