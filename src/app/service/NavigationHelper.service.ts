import { Injectable, inject } from '@angular/core'
import { BasePaths, UrlPaths } from '../app-paths'
import { Router } from '@angular/router'

/**
 * Service for handling navigation throughout the application.
 * Provides centralized navigation methods for different features.
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationHelperService {
  private router = inject(Router)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Navigates to {@link UrlPaths.feasibilityQuery.result | /feasibility-query/result}
   * @returns
   */
  public navigateToFeasibilityQueryResult(): void {
    this.router.navigate([UrlPaths.feasibilityQuery.result], {
      state: { preventReset: true, startPolling: true },
    })
  }

  /**
   * Navigates to {@link UrlPaths.feasibilityQuery.editor | /feasibility-query/editor}
   * @param id - The query profile identifier
   * @returns
   */
  public navigateToEditProfile(id: string, state?: { activeTab: string }): void {
    this.router.navigate([`${UrlPaths.queryEditor.feature}`, id], { state })
  }

  public navigateToEditCriterion(id: string): void {
    this.router.navigate([`${UrlPaths.queryEditor.criteria}`, id])
  }

  public navigateToEditReferenceCriterion(id: string): void {
    this.router.navigate([`${UrlPaths.queryEditor.reference}`, id])
  }

  /**
   * Navigates to {@link UrlPaths.feasibilityQuery.editor | /feasibility-query/editor}
   * @returns
   */
  public navigateToFeasibilityQueryEditor(): void {
    this.router.navigate([UrlPaths.feasibilityQuery.editor])
  }

  /**
   * Navigates to {@link UrlPaths.feasibilityQuery.search | /feasibility-query/search}
   * @returns
   */
  public navigateToFeasibilityQuerySearch(): void {
    this.router.navigate([UrlPaths.feasibilityQuery.search])
  }

  /**
   * Navigates to {@link UrlPaths.dataSelection.editor | /data-selection/editor}
   * @returns
   */
  public navigateToFeasibilityQueryBulkSearch(): void {
    this.router.navigate([UrlPaths.feasibilityQuery.bulkSearch])
  }

  /**
   * Navigates to the data selection editor page.
   * @returns
   */
  public navigateToDataSelectionEditor(): void {
    this.router.navigate([UrlPaths.dataSelection.editor])
  }

  /**
   * Navigates to {@link UrlPaths.dataSelection.search | /data-selection/search}
   * @returns
   */
  public navigateToDataSelectionSearch(): void {
    this.router.navigate([UrlPaths.dataSelection.search])
  }

  /**
   * Navigates to {@link UrlPaths.dataQuery.cohortDefinition | /data-query/cohort-definition}
   * @returns
   */
  public navigateToDataQueryCohortDefinition(): void {
    this.router.navigate([UrlPaths.dataQuery.cohortDefinition], {
      state: { preventReset: true },
    })
  }

  /**
   * Navigates to {@link UrlPaths.dataQuery.dataSelection | /data-query/data-selection}
   * @returns
   */
  public navigateToDataQueryDataSelection(): void {
    this.router.navigate([UrlPaths.dataQuery.dataSelection], {
      state: { preventReset: true },
    })
  }

  /**
   * Navigates to {@link BasePaths.savedQueries | /saved-queries}
   * @returns
   */
  public navigateToSavedQueries(): void {
    this.router.navigate([BasePaths.savedQueries], {
      state: { preventReset: true },
    })
  }
}
