import { Component } from '@angular/core'
import { SnackbarComponent } from '../../../shared/components/snack-bar/snackbar.component'
import { ErrorDisplayComponent } from '../../../shared/components/error-display/error-display.component'
import { MatToolbar } from '@angular/material/toolbar'
import { BreadcrumbComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component'
import { LanguageComponent } from '../language/language.component'
import { UserMenuComponent } from './user-menu/user-menu.component'
import { PortalLinkComponent } from './portal-link/portal-link.component'

@Component({
  selector: 'num-dataportal-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    SnackbarComponent,
    ErrorDisplayComponent,
    MatToolbar,
    BreadcrumbComponent,
    LanguageComponent,
    UserMenuComponent,
    PortalLinkComponent,
  ],
})
export class HeaderComponent {
  imagePath = 'assets/img/FDPG-Logo.svg'
  urlAlt: string
}
