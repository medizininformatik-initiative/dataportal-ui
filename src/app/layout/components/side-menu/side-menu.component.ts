import INavItem from '../../models/nav-item.interface'
import { mainNavItems } from '../../../core/constants/navigation'
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core'
import { MatIconRegistry, MatIcon } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'
import { MatNavList, MatListItem } from '@angular/material/list'
import { NgClass } from '@angular/common'
import { RouterLinkActive, RouterLink } from '@angular/router'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatIconButton } from '@angular/material/button'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [
    MatNavList,
    NgClass,
    MatListItem,
    RouterLinkActive,
    RouterLink,
    MatTooltip,
    FontAwesomeModule,
    MatIcon,
    MatIconButton,
    TranslateModule,
  ],
})
export class SideMenuComponent implements OnInit {
  private iconRegistry = inject(MatIconRegistry)
  private sanitizer = inject(DomSanitizer)

  mainNavItems = mainNavItems
  @Input() isSideMenuExpanded = true

  @Output() toggleSideMenu = new EventEmitter<boolean>()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    const iconRegistry = this.iconRegistry
    const sanitizer = this.sanitizer

    iconRegistry.addSvgIcon(
      'cohort-network',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/cohort-network.svg')
    )
  }

  ngOnInit(): void {}

  menuItemClicked($event: Event, item?: INavItem): void {
    const target = $event.currentTarget as HTMLElement
    target.blur()
  }

  public toggleMenu(): void {
    this.isSideMenuExpanded = !this.isSideMenuExpanded
    this.toggleSideMenu.emit(this.isSideMenuExpanded)
  }
}
