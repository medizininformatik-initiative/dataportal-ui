import { Component, OnInit } from '@angular/core';
import { HeaderDescriptionToggleService } from '../header/header-description-toggle.service';

@Component({
  selector: 'num-header-description',
  templateUrl: './header-description.component.html',
  styleUrls: ['./header-description.component.scss'],
})
export class HeaderDescriptionComponent {
  constructor(public toggleService: HeaderDescriptionToggleService) {}
}
