import { NgClass } from '@angular/common'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router'
import { filter, Subscription } from 'rxjs'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { BasePaths, PathSegments } from '../../../app-paths'
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
  imports: [NgClass, MatTooltip, DisplayTranslationPipe],
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly profileProviderService = inject(ProfileProviderService)
  private readonly criterionProviderService = inject(CriterionProviderService)
  private readonly navigationHelperService = inject(NavigationHelperService)

  public breadcrumbs: Breadcrumb[] = []
  private sub: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public ngOnInit(): void {
    this.breadcrumbs = this.buildBreadcrumb(this.activatedRoute.root)
    this.appendElementBreadcrumb()
    this.sub = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.breadcrumbs = this.buildBreadcrumb(this.activatedRoute.root)
      this.appendElementBreadcrumb()
    })
  }

  public ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  public navigateTo(url: string): void {
    const segments = url.replace(/^\//, '').split('/')
    const basePath = segments[0]
    const subPath = segments[1]
    const id = segments[2]

    if (basePath === BasePaths.queryEditor) {
      const target = subPath === PathSegments.feature ? `/${BasePaths.dataSelection}/${PathSegments.editor}` : `/${BasePaths.dataQuery}`
      this.router.navigate([target])
      return
    }

    const targetPath = BASE_PATH_DEFAULTS[basePath] ?? url
    this.router.navigate([targetPath])
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

  public buildBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children
    if (children.length === 0) {
      return breadcrumbs
    }
    for (const child of children) {
      const routeURL: string = child.snapshot.url.map((segment: UrlSegment) => segment.path).join('/')
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
