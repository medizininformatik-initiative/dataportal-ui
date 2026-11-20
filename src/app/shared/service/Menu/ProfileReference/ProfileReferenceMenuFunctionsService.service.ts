import { inject, Injectable } from '@angular/core'
import { NavigationHelperService } from '../../../../service/NavigationHelper.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileReferenceMenuFunctionsService {
  private navigationHelperService = inject(NavigationHelperService)

  constructor() {}

  public navigate(id: string, args?: Record<string, unknown>) {
    const elementId = args?.elementId as string | undefined
    const state = elementId ? { activeTab: elementId } : undefined
    this.navigationHelperService.navigateToEditProfile(id, state)
  }
}
