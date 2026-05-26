import { Component } from '@angular/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-linked-badge',
  templateUrl: './linked-badge.component.html',
  styleUrls: ['./linked-badge.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, TranslateModule],
})
export class LinkedBadgeComponent {}
