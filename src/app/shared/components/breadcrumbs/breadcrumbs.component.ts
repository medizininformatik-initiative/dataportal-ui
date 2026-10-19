import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router'
import { BasePaths, PathSegments } from '../../../app-paths'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { filter, Subscription } from 'rxjs'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { TranslateModule } from '@ngx-translate/core'
import { MatTooltip } from '@angular/material/tooltip'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'

interface Breadcrumb {
  label: string | Display
  url: string
}

const BASE_PATH_DEFAULTS: Record<string, string> = {
  [BasePaths.feasibilityQuery]: `/${BasePaths.feasibilityQuery}/${PathSegments.search}`,
  [BasePaths.dataSelection]: `/${BasePaths.dataSelection}/${PathSegments.search}`,
  [BasePaths.dataQuery]: `/${BasePaths.dataQuery}`,
  [BasePaths.savedQueries]: `/${BasePaths.savedQueries}`,
}

@Component({
  selector: 'num-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  standalone: true,
  imports: [RouterLink, TranslateModule, MatTooltip, DisplayTranslationPipe],
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)
  private profileProviderService = inject(ProfileProviderService)
  private criterionProviderService = inject(CriterionProviderService)
  private navigationHelperService = inject(NavigationHelperService)

  breadcrumbs: Breadcrumb[] = []
  private sub: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit(): void {
    this.breadcrumbs = this.buildBreadcrumb(this.activatedRoute.root)
    this.appendElementBreadcrumb()
    this.sub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadcrumb(this.activatedRoute.root)
        this.appendElementBreadcrumb()
      })
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  /** Router target of a crumb: the query editor trail points to its parent page, base paths to their default child. */
  targetOf(url: string): string {
    const [basePath, subPath] = url.replace(/^\//, '').split('/')

    if (basePath === BasePaths.queryEditor) {
      return subPath === PathSegments.feature
        ? `/${BasePaths.dataSelection}/${PathSegments.editor}`
        : `/${BasePaths.dataQuery}`
    }

    return BASE_PATH_DEFAULTS[basePath] ?? url
  }

  private appendElementBreadcrumb(): void {
    const segments = this.router.url.replace(/^\//, '').split('/')
    if (segments[0] !== BasePaths.queryEditor) {
      return
    }
    const subPath = segments[1]
    const id = segments[2]
    if (!id) {
      return
    }
    const display = this.resolveQueryEditorId(subPath, id)
    if (display) {
      this.breadcrumbs.push({ label: display, url: this.router.url })
    }
  }

  private resolveQueryEditorId(subPath: string, id: string): Display {
    if (subPath === PathSegments.feature) {
      const profile = this.profileProviderService.getOne(id)
      return profile.getDisplay()
    } else if (subPath === PathSegments.criterion) {
      const criterion = this.criterionProviderService.getOne(id)
      return criterion.getDisplay()
    }
  }

  buildBreadcrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children
    if (children.length === 0) {
      return breadcrumbs
    }
    for (const child of children) {
      const routeURL: string = child.snapshot.url.map((segment) => segment.path).join('/')
      if (routeURL !== '') {
        url += `/${routeURL}`
        const label = child.snapshot.data.breadcrumb
        if (label) {
          breadcrumbs.push({ label, url })
        }
      }
      return this.buildBreadcrumb(child, url, breadcrumbs)
    }
    return breadcrumbs
  }
}
