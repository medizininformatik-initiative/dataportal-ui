import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, merge, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabTitleService {
  constructor(
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  public initializeTitleListener() {
    const onNavEnd$ = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));

    merge(onNavEnd$, this.translate.onLangChange)
      .pipe(
        map(() => {
          let route = this.route.root;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot.data;
        }),
        filter((data) => !!data?.title),
        switchMap((data) => this.translate.get(data.title))
      )
      .subscribe((translatedTitle) => {
        this.titleService.setTitle(translatedTitle);
      });
  }
}
