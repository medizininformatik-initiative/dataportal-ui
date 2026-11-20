import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router'
import { BasePaths, PathSegments, UrlPaths } from '../../../app-paths'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { filter, Subscription } from 'rxjs'
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service'
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
  private referenceCriterionProviderService = inject(ReferenceCriterionProviderService)

  breadcrumbs: Breadcrumb[] = []
  private sub: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit(): void {
    this.refresh()
    this.sub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.refresh())
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  /** Router target of a crumb: a bare base path leads to its default child, any deeper url is its own target. */
  targetOf(url: string): string {
    const segments = url.replace(/^\//, '').split('/')
    return segments.length > 1 ? url : BASE_PATH_DEFAULTS[segments[0]] ?? url
  }

  private refresh(): void {
    const [basePath, subPath, id] = this.router.url.split(/[?#]/)[0].replace(/^\//, '').split('/')
    this.breadcrumbs =
      basePath === BasePaths.queryEditor
        ? this.buildQueryEditorTrail(subPath, id)
        : this.buildBreadcrumb(this.activatedRoute.root)
  }

  /** Query editor pages: the page they were opened from (and return to), then the edited element. */
  private buildQueryEditorTrail(subPath: string, id: string): Breadcrumb[] {
    const isFeature = subPath === PathSegments.feature
    const trail: Breadcrumb[] = isFeature
      ? [
          { label: 'BREADCRUMB.DATA_SELECTION', url: `/${BasePaths.dataSelection}` },
          { label: 'BREADCRUMB.DATA_SELECTION_EDITOR', url: `/${UrlPaths.dataSelection.editor}` },
        ]
      : [
          { label: 'BREADCRUMB.FEASIBILITY_QUERY', url: `/${BasePaths.feasibilityQuery}` },
          {
            label: 'BREADCRUMB.FEASIBILITY_QUERY_EDITOR',
            url: `/${UrlPaths.feasibilityQuery.editor}`,
          },
        ]
    const display = id && this.resolveQueryEditorId(subPath, id)
    if (display) {
      trail.push({ label: display, url: this.router.url })
    }
    return trail
  }

  private resolveQueryEditorId(subPath: string, id: string): Display | undefined {
    if (subPath === PathSegments.feature) {
      return this.profileProviderService.getOne(id)?.getDisplay()
    } else if (subPath === PathSegments.criterion) {
      return this.criterionProviderService.getOne(id)?.getDisplay()
    } else if (subPath === PathSegments.reference) {
      return this.referenceCriterionProviderService.getOne(id)?.getDisplay()
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
        // routeConfig, not snapshot.data: the snapshot inherits the parent's data through empty-path and componentless parents
        const label = child.routeConfig?.data?.breadcrumb
        if (label) {
          breadcrumbs.push({ label, url })
        }
      }
      return this.buildBreadcrumb(child, url, breadcrumbs)
    }
    return breadcrumbs
  }
}
