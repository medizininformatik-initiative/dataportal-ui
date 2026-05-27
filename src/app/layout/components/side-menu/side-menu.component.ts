import INavItem from '../../models/nav-item.interface'
import { mainNavItems } from '../../../core/constants/navigation'
import { Component, computed, inject, model, output } from '@angular/core'
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
export class SideMenuComponent {
  private iconRegistry = inject(MatIconRegistry)
  private sanitizer = inject(DomSanitizer)

  mainNavItems = mainNavItems
  readonly isSideMenuExpanded = model(true)
  readonly isCollapsed = computed(() => !this.isSideMenuExpanded())

  readonly toggleSideMenu = output<boolean>()

  constructor() {
    const iconRegistry = this.iconRegistry
    const sanitizer = this.sanitizer

    iconRegistry.addSvgIcon(
      'cohort-network',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/cohort-network.svg')
    )
  }

  menuItemClicked($event: Event, item?: INavItem): void {
    const target = $event.currentTarget as HTMLElement
    target.blur()
  }

  public toggleMenu(): void {
    this.isSideMenuExpanded.update((expanded) => !expanded)
    this.toggleSideMenu.emit(this.isSideMenuExpanded())
  }
}
