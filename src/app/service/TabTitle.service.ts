import { Injectable, inject } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { filter, map, merge, switchMap } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TabTitleService {
  private titleService = inject(Title)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private translate = inject(TranslateService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public initializeTitleListener() {
    const onNavEnd$ = this.router.events.pipe(filter((event) => event instanceof NavigationEnd))

    merge(onNavEnd$, this.translate.onLangChange)
      .pipe(
        map(() => {
          let route = this.route.root
          while (route.firstChild) {
            route = route.firstChild
          }
          return route.snapshot.data
        }),
        filter((data) => !!data?.title),
        switchMap((data) => this.translate.get(data.title))
      )
      .subscribe((translatedTitle) => {
        this.titleService.setTitle(translatedTitle)
      })
  }
}
