import { Component, OnInit, inject } from '@angular/core'
import { HeaderDescriptionToggleService } from '../header/header-description-toggle.service'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'num-header-description',
  templateUrl: './header-description.component.html',
  styleUrls: ['./header-description.component.scss'],
  standalone: true,
  imports: [AsyncPipe],
})
export class HeaderDescriptionComponent {
  toggleService = inject(HeaderDescriptionToggleService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}
}
