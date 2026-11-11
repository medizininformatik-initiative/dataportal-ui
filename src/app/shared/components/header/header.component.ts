import { Component, inject, input } from '@angular/core'
import { HeaderDescriptionToggleService } from './header-description-toggle.service'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { AsyncPipe, NgTemplateOutlet } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [MatTooltip, FontAwesomeModule, AsyncPipe, NgTemplateOutlet, TranslateModule],
})
export class HeaderComponent {
  toggleService = inject(HeaderDescriptionToggleService)

  /** false renders the title as a span, e.g. for the step that is not the current page */
  readonly isHeading = input(true)

  readonly showToggle = input(
    false
    /** Inserted by Angular inject() migration for backwards compatibility */
  )

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}
}
