import { Component } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-missing-filter',
  templateUrl: './missing-filter.component.html',
  styleUrls: ['./missing-filter.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class MissingFilterComponent {
  constructor() {}
}
