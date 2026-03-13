import { Component } from '@angular/core';

@Component({
  selector: 'num-dataportal-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  imagePath = 'assets/img/FDPG-Logo.svg';
  urlAlt: string;
}
