import { Component } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-error-log-header',
  templateUrl: './error-log-header.component.html',
  styleUrls: ['./error-log-header.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class ErrorLogHeaderComponent {}
