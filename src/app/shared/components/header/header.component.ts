import { Component, Input } from '@angular/core';
import { HeaderDescriptionToggleService } from './header-description-toggle.service';

@Component({
  selector: 'num-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() showToggle = false;

  constructor(public toggleService: HeaderDescriptionToggleService) {}
}
