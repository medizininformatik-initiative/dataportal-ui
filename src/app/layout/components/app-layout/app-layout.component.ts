import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { routeAnimations } from 'src/app/route-animations'
import { Component, OnInit, inject } from '@angular/core'
import { filter, map, mergeMap } from 'rxjs'
import { HeaderComponent } from '../header/header.component'
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav'
import { SideMenuComponent } from '../side-menu/side-menu.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
  animations: [routeAnimations],
  standalone: true,
  imports: [
    HeaderComponent,
    MatSidenavContainer,
    MatSidenav,
    SideMenuComponent,
    MatSidenavContent,
    RouterOutlet,
    TranslateModule,
  ],
})
export class AppLayoutComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router)

  isHandset: boolean
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

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation
  }

  toggleSideMenu(): void {
    this.isSideMenuExpanded = !this.isSideMenuExpanded
  }
}
