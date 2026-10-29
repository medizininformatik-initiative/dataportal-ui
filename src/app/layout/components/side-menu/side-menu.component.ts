import { NgClass } from '@angular/common'
import { Component, computed, inject, model, output } from '@angular/core'
import { MatIconButton } from '@angular/material/button'
import { MatIconRegistry, MatIcon } from '@angular/material/icon'
import { MatNavList, MatListItem } from '@angular/material/list'
import { MatTooltip } from '@angular/material/tooltip'
import { DomSanitizer } from '@angular/platform-browser'
import { RouterLinkActive, RouterLink } from '@angular/router'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { mainNavItems } from '../../../core/constants/navigation'
import { NumDataCyDirective } from '../../../shared/directives/num-data-cy.directive'
import INavItem from '../../models/nav-item.interface'

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
    NumDataCyDirective,
  ],
})
export class SideMenuComponent {
  private readonly iconRegistry = inject(MatIconRegistry)
  private readonly sanitizer = inject(DomSanitizer)

  public mainNavItems = mainNavItems
  public readonly isSideMenuExpanded = model(true)
  public readonly isCollapsed = computed(() => !this.isSideMenuExpanded())

  public readonly toggleSideMenu = output<boolean>()

  constructor() {
    const iconRegistry = this.iconRegistry
    const sanitizer = this.sanitizer

    iconRegistry.addSvgIcon('cohort-network', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/cohort-network.svg'))
  }

  public menuItemClicked($event: Event, item?: INavItem): void {
    const target = $event.currentTarget as HTMLElement
    target.blur()
  }

  public toggleMenu(): void {
    this.isSideMenuExpanded.update((expanded: boolean) => !expanded)
    this.toggleSideMenu.emit(this.isSideMenuExpanded())
  }
}
