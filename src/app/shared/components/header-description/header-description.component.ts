import { AsyncPipe } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { HeaderDescriptionToggleService } from '../header/header-description-toggle.service'

@Component({
  selector: 'num-header-description',
  templateUrl: './header-description.component.html',
  styleUrls: ['./header-description.component.scss'],
  standalone: true,
  imports: [AsyncPipe],
})
export class HeaderDescriptionComponent {
  public toggleService = inject(HeaderDescriptionToggleService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}
}
