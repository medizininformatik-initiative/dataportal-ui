import { Component } from '@angular/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

@Component({
  selector: 'num-placeholder-box',
  templateUrl: './placeholder-box.component.html',
  styleUrls: ['./placeholder-box.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule],
})
export class PlaceholderBoxComponent {}
