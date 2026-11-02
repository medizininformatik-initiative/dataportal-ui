import { Injectable, inject } from '@angular/core'
import { Router } from '@angular/router'
import { BasePaths, UrlPaths } from '../app-paths'

/**
 * Service for handling navigation throughout the application.
 * Provides centralized navigation methods for different features.
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationHelperService {
  private readonly router = inject(Router)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Navigates to {@link UrlPaths.feasibilityQuery.result | /feasibility-query/result}
   */
  public navigateToFeasibilityQueryResult(): void {
    this.router.navigate([UrlPaths.feasibilityQuery.result], {
      state: { preventReset: true, startPolling: true },
    })
  }

  /**
   * Navigates to {@link UrlPaths.feasibilityQuery.editor | /feasibility-query/editor}
   * @param {string} id - The query profile identifier
   * @param {{ activeTab: string }} state
   * @param {string} state.activeTab
   */
  public navigateToEditProfile(id: string, state?: { activeTab: string }): void {
    this.router.navigate([`${UrlPaths.queryEditor.feature}`, id], { state })
  }

  /**
   * Navigates to the criterion editor.
   * @param {string} id
   */
  public navigateToEditCriterion(id: string): void {
    this.router.navigate([`${UrlPaths.queryEditor.criteria}`, id])
  }

  /**
   * Navigates to the reference criterion editor.
   * @param {string} id
   */
  public navigateToEditReferenceCriterion(id: string): void {
    this.router.navigate([`${UrlPaths.queryEditor.reference}`, id])
  }

  /**
   * Navigates to {@link UrlPaths.feasibilityQuery.editor | /feasibility-query/editor}
   */
  public navigateToFeasibilityQueryEditor(): void {
    this.router.navigate([UrlPaths.feasibilityQuery.editor])
  }

  /**
   * Navigates to {@link UrlPaths.feasibilityQuery.search | /feasibility-query/search}
   */
  public navigateToFeasibilityQuerySearch(): void {
    this.router.navigate([UrlPaths.feasibilityQuery.search])
  }

  /**
   * Navigates to {@link UrlPaths.dataSelection.editor | /data-selection/editor}
   */
  public navigateToFeasibilityQueryBulkSearch(): void {
    this.router.navigate([UrlPaths.feasibilityQuery.bulkSearch])
  }

  /**
   * Navigates to the data selection editor page.
   */
  public navigateToDataSelectionEditor(): void {
    this.router.navigate([UrlPaths.dataSelection.editor])
  }

  /**
   * Navigates to {@link UrlPaths.dataSelection.search | /data-selection/search}
   */
  public navigateToDataSelectionSearch(): void {
    this.router.navigate([UrlPaths.dataSelection.search])
  }

  /**
   * Navigates to {@link UrlPaths.dataQuery.cohortDefinition | /data-query/cohort-definition}
   */
  public navigateToDataQueryCohortDefinition(): void {
    this.router.navigate([UrlPaths.dataQuery.cohortDefinition], {
      state: { preventReset: true },
    })
  }

  /**
   * Navigates to {@link UrlPaths.dataQuery.dataSelection | /data-query/data-selection}
   */
  public navigateToDataQueryDataSelection(): void {
    this.router.navigate([UrlPaths.dataQuery.dataSelection], {
      state: { preventReset: true },
    })
  }

  /**
   * Navigates to {@link BasePaths.savedQueries | /saved-queries}
   */
  public navigateToSavedQueries(): void {
    this.router.navigate([BasePaths.savedQueries], {
      state: { preventReset: true },
    })
  }

  /**
   * Returns the active tab from the current navigation state.
   * @returns {string}
   */
  public getCurrentNavigation(): string {
    return this.router.getCurrentNavigation()?.extras.state?.['activeTab']
  }
}
