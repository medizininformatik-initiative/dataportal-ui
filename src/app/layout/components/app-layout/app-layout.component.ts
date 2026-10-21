import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { routeAnimations } from 'src/app/route-animations'
import { Component, OnInit, inject } from '@angular/core'
import { filter, map, mergeMap } from 'rxjs'
import { HeaderComponent } from '../header/header.component'
import { SideMenuComponent } from '../side-menu/side-menu.component'
import { SnackbarComponent } from '../../../shared/components/snack-bar/snackbar.component'
import { ErrorDisplayComponent } from '../../../shared/components/error-display/error-display.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
  animations: [routeAnimations],
  standalone: true,
  imports: [
    HeaderComponent,
    SideMenuComponent,
    RouterOutlet,
    TranslateModule,
    SnackbarComponent,
    ErrorDisplayComponent,
  ],
})
export class AppLayoutComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router)

  isSideMenuExpanded = true
  showSideNav = true

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute.firstChild),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        this.showSideNav = data.hideSideNav ?? true
      })
  }

  /** Moves focus into <main>; a plain #hash link would be eaten by the router. */
  focusMain(event: Event) {
    event.preventDefault()
    document.getElementById('main-content')?.focus()
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation
  }
}
