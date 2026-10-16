import { Component, computed, inject, model, output } from '@angular/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { mainNavItems } from '../../../core/constants/navigation'
import { MatTooltip } from '@angular/material/tooltip'
import { NgTemplateOutlet } from '@angular/common'
import { IsActiveMatchOptions, Router, RouterLink, RouterLinkActive } from '@angular/router'
import NavItemData from '../../models/nav-item.interface'
import { TranslateModule } from '@ngx-translate/core'

const EXACT = { exact: true }
const SUBSET = { exact: false }
const FRAGMENT_EXACT: IsActiveMatchOptions = {
  paths: 'exact',
  queryParams: 'ignored',
  fragment: 'exact',
  matrixParams: 'ignored',
}

@Component({
  selector: 'num-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    MatTooltip,
    FontAwesomeModule,
    TranslateModule,
  ],
  host: { '[class.collapsed]': 'isCollapsed()' },
})
export class SideMenuComponent {
  mainNavItems = mainNavItems
  readonly isSideMenuExpanded = model(true)
  readonly isCollapsed = computed(() => !this.isSideMenuExpanded())

  readonly toggleSideMenu = output<boolean>()

  private readonly router = inject(Router)

  constructor() {}

  // items with expandOnActive show their children only while their route is active
  isOpen(item: NavItemData): boolean {
    return (
      !item.expandOnActive ||
      this.router.isActive(this.router.parseUrl('/' + item.routeTo?.replace(/^\//, '')), {
        paths: 'subset',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored',
      })
    )
  }

  // fragment links are only active for their own fragment (constants: a new object per check would
  // re-trigger routerLinkActive on every change detection)
  activeOptions(item: NavItemData, child: boolean): { exact: boolean } | IsActiveMatchOptions {
    if (item.fragment) return FRAGMENT_EXACT
    return !child && this.isSideMenuExpanded() ? EXACT : SUBSET
  }

  public toggleMenu(): void {
    this.isSideMenuExpanded.update((expanded) => !expanded)
    this.toggleSideMenu.emit(this.isSideMenuExpanded())
  }
}
