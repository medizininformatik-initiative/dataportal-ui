import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { BasePaths, PathSegments } from '../../../app-paths';
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service';
import { ProfileProviderService } from 'src/app/modules/data-selection/services/ProfileProvider.service';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { Display } from 'src/app/model/DataSelection/Profile/Display';

interface Breadcrumb {
  label: string | Display
  url: string
}

const BASE_PATH_DEFAULTS: Record<string, string> = {
  [BasePaths.feasibilityQuery]: `/${BasePaths.feasibilityQuery}/${PathSegments.search}`,
  [BasePaths.dataSelection]: `/${BasePaths.dataSelection}/${PathSegments.search}`,
  [BasePaths.dataQuery]: `/${BasePaths.dataQuery}`,
  [BasePaths.savedQueries]: `/${BasePaths.savedQueries}`,
};

@Component({
  selector: 'num-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[] = [];
  private sub: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private profileProviderService: ProfileProviderService,
    private criterionProviderService: CriterionProviderService,
    private navigationHelperService: NavigationHelperService
  ) {}

  ngOnInit(): void {
    this.breadcrumbs = this.buildBreadcrumb(this.activatedRoute.root);
    this.appendElementBreadcrumb();
    this.sub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadcrumb(this.activatedRoute.root);
        this.appendElementBreadcrumb();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  navigateTo(url: string): void {
    const segments = url.replace(/^\//, '').split('/');
    const basePath = segments[0];
    const subPath = segments[1];
    const id = segments[2];

    if (basePath === BasePaths.queryEditor) {
      const target =
        subPath === PathSegments.feature
          ? `/${BasePaths.dataSelection}/${PathSegments.editor}`
          : `/${BasePaths.dataQuery}`;
      this.router.navigate([target]);
      return;
    }

    const targetPath = BASE_PATH_DEFAULTS[basePath] ?? url;
    this.router.navigate([targetPath]);
  }

  private appendElementBreadcrumb(): void {
    const segments = this.router.url.replace(/^\//, '').split('/');
    if (segments[0] !== BasePaths.queryEditor) {
      return;
    }
    const subPath = segments[1];
    const id = segments[2];
    if (!id) {
      return;
    }
    const display = this.resolveQueryEditorId(subPath, id);
    if (display) {
      this.breadcrumbs.push({ label: display, url: this.router.url });
    }
  }

  private resolveQueryEditorId(subPath: string, id: string): Display {
    if (subPath === PathSegments.feature) {
      const profile = this.profileProviderService.getProfileById(id);
      return profile.getDisplay();
    } else if (subPath === PathSegments.criterion) {
      const criterion = this.criterionProviderService.getCriterionByUID(id);
      return criterion.getDisplay();
    }
  }

  buildBreadcrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }
    for (const child of children) {
      const routeURL: string = child.snapshot.url.map((segment) => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
        const label = child.snapshot.data.breadcrumb;
        if (label) {
          breadcrumbs.push({ label, url });
        }
      }
      return this.buildBreadcrumb(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }
}
