import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service';
import { Injectable } from '@angular/core';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { Observable, of } from 'rxjs';
import { PathSegments } from 'src/app/app-paths';
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service';
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service';

@Injectable({ providedIn: 'root' })
export class RouteGuard implements CanActivate {
  constructor(
    private criterionProviderService: CriterionProviderService,
    private navigationHelperService: NavigationHelperService,
    private referenceCriterionProviderService: ReferenceCriterionProviderService,
    private profileService: ProfileProviderService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.paramMap.get('id');
    const url = route.url[0]?.path;
    if (url === PathSegments.feature) {
      return this.handleProfile(id);
    } else if (url === PathSegments.criterion) {
      return this.handleCriterion(id);
    } else if (url === PathSegments.reference) {
      return this.handleReferenceCriterion(id);
    } else {
      this.router.navigate(['']);
      return of(false);
    }
  }

  private handleProfile(id: string) {
    try {
      const canRoute = this.profileService.getOne(id) ? true : false;
      if (!canRoute) {
        this.navigationHelperService.navigateToDataSelectionSearch();
        return of(false);
      }
      return of(true);
    } catch {
      this.navigationHelperService.navigateToDataSelectionSearch();
      return of(false);
    }
  }

  private handleCriterion(id: string) {
    try {
      const canRoute = this.criterionProviderService.getOne(id) ? true : false;
      if (!canRoute) {
        this.navigationHelperService.navigateToFeasibilityQuerySearch();
        return of(false);
      }
      return of(true);
    } catch {
      this.navigationHelperService.navigateToFeasibilityQuerySearch();
      return of(false);
    }
  }

  private handleReferenceCriterion(id: string) {
    try {
      const canRoute = this.referenceCriterionProviderService.getOne(id) ? true : false;
      if (!canRoute) {
        this.navigationHelperService.navigateToFeasibilityQuerySearch();
        return of(false);
      }
      return of(true);
    } catch {
      this.navigationHelperService.navigateToFeasibilityQuerySearch();
      return of(false);
    }
  }
}
