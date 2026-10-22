import { Component } from '@angular/core'
import { MatToolbar } from '@angular/material/toolbar'
import { BreadcrumbComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component'
import { LanguageComponent } from '../language/language.component'
import { UserMenuComponent } from './user-menu/user-menu.component'
import { PortalLinkComponent } from './portal-link/portal-link.component'
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component'

@Component({
  selector: 'num-dataportal-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    MatToolbar,
    BreadcrumbComponent,
    LanguageComponent,
    UserMenuComponent,
    PortalLinkComponent,
    ThemeToggleComponent,
  ],
})
export class HeaderComponent {
  imagePath = 'assets/img/FDPG-Logo.svg'
  urlAlt: string
}
