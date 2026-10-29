import { Component, OnInit, inject } from '@angular/core'
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav'
import { ActivatedRoute, Data, NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { filter, map, mergeMap } from 'rxjs'
import { routeAnimations } from 'src/app/route-animations'
import { HeaderComponent } from '../header/header.component'
import { SideMenuComponent } from '../side-menu/side-menu.component'

@Component({
  selector: 'num-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
  animations: [routeAnimations],
  standalone: true,
  imports: [HeaderComponent, MatSidenavContainer, MatSidenav, SideMenuComponent, MatSidenavContent, RouterOutlet, TranslateModule],
})
export class AppLayoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly router = inject(Router)

  public isHandset: boolean
  public isSideMenuExpanded = true
  public showSideNav = true

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute.firstChild),
        mergeMap((route: ActivatedRoute) => route.data)
      )
      .subscribe((data: Data) => {
        this.showSideNav = data.hideSideNav ?? true
      })
  }

  public prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation
  }

  public toggleSideMenu(): void {
    this.isSideMenuExpanded = !this.isSideMenuExpanded
  }
}
