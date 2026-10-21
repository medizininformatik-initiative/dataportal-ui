import { Component, computed, model, output } from '@angular/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { mainNavItems } from '../../../core/constants/navigation'
import { MatTooltip } from '@angular/material/tooltip'
import { NgTemplateOutlet } from '@angular/common'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { NumDataCyDirective } from '../../../shared/directives/num-data-cy.directive'

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
    NumDataCyDirective,
  ],
  host: { '[class.collapsed]': 'isCollapsed()' },
})
export class SideMenuComponent {
  mainNavItems = mainNavItems
  readonly isSideMenuExpanded = model(true)
  readonly isCollapsed = computed(() => !this.isSideMenuExpanded())

  readonly toggleSideMenu = output<boolean>()

  constructor() {}

  public toggleMenu(): void {
    this.isSideMenuExpanded.update((expanded) => !expanded)
    this.toggleSideMenu.emit(this.isSideMenuExpanded())
  }
}
