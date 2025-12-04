import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { routeAnimations } from 'src/app/route-animations';
import { Component, OnInit } from '@angular/core';
import { filter, map, mergeMap } from 'rxjs';

@Component({
  selector: 'num-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
  animations: [routeAnimations],
})
export class AppLayoutComponent implements OnInit {
  isHandset: boolean;
  isSideMenuExpanded = true;
  showSideNav = true;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute.firstChild),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        this.showSideNav = data.hideSideNav ?? true;
      });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  toggleSideMenu(): void {
    this.isSideMenuExpanded = !this.isSideMenuExpanded;
  }
}
