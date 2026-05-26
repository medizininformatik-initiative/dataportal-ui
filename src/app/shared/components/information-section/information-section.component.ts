import { Component } from '@angular/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

@Component({
  selector: 'num-information-section',
  templateUrl: './information-section.component.html',
  styleUrls: ['./information-section.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule],
})
export class InformationSectionComponent {}
