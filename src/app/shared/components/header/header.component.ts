import { Component, Input, inject } from '@angular/core'
import { HeaderDescriptionToggleService } from './header-description-toggle.service'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [MatTooltip, FontAwesomeModule, AsyncPipe, TranslateModule],
})
export class HeaderComponent {
  toggleService = inject(HeaderDescriptionToggleService)

  @Input() showToggle = false

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}
}
