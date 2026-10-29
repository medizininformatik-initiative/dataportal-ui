import { AsyncPipe } from '@angular/common'
import { Component, inject, input } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { HeaderDescriptionToggleService } from './header-description-toggle.service'

@Component({
  selector: 'num-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [MatTooltip, FontAwesomeModule, AsyncPipe, TranslateModule],
})
export class HeaderComponent {
  public toggleService = inject(HeaderDescriptionToggleService)

  public readonly showToggle = input(
    false
    /** Inserted by Angular inject() migration for backwards compatibility */
  )

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}
}
