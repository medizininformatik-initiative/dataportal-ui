import { Injectable, inject } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { PathSegments } from 'src/app/app-paths'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service'

@Injectable({ providedIn: 'root' })
export class RouteGuard implements CanActivate {
  private readonly criterionProviderService = inject(CriterionProviderService)
  private readonly navigationHelperService = inject(NavigationHelperService)
  private readonly referenceCriterionProviderService = inject(ReferenceCriterionProviderService)
  private readonly profileService = inject(ProfileProviderService)
  private readonly router = inject(Router)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.paramMap.get('id')
    const url = route.url[0]?.path
    if (url === PathSegments.feature) {
      return this.handleProfile(id)
    } else if (url === PathSegments.criterion) {
      return this.handleCriterion(id)
    } else if (url === PathSegments.reference) {
      return this.handleReferenceCriterion(id)
    } else {
      this.router.navigate([''])
      return of(false)
    }
  }

  private handleProfile(id: string) {
    try {
      const canRoute = this.profileService.getOne(id) ? true : false
      if (!canRoute) {
        this.navigationHelperService.navigateToDataSelectionSearch()
        return of(false)
      }
      return of(true)
    } catch {
      this.navigationHelperService.navigateToDataSelectionSearch()
      return of(false)
    }
  }

  private handleCriterion(id: string) {
    try {
      const canRoute = this.criterionProviderService.getOne(id) ? true : false
      if (!canRoute) {
        this.navigationHelperService.navigateToFeasibilityQuerySearch()
        return of(false)
      }
      return of(true)
    } catch {
      this.navigationHelperService.navigateToFeasibilityQuerySearch()
      return of(false)
    }
  }

  private handleReferenceCriterion(id: string) {
    try {
      const canRoute = this.referenceCriterionProviderService.getOne(id) ? true : false
      if (!canRoute) {
        this.navigationHelperService.navigateToFeasibilityQuerySearch()
        return of(false)
      }
      return of(true)
    } catch {
      this.navigationHelperService.navigateToFeasibilityQuerySearch()
      return of(false)
    }
  }
}
