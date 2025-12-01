import { Injectable } from '@angular/core';
import { BasePaths, UrlPaths } from '../app-paths';
import { Router } from '@angular/router';

/**
 * Service for handling navigation throughout the application.
 * Provides centralized navigation methods for different features.
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationHelperService {
  constructor(private router: Router) {}

  /**
   * Navigates to the feasibility query result page.
   * Prevents reset and starts polling for results.
   * @returns
   */
  public navigateToFeasibilityQueryResult(): void {
    this.router.navigate([UrlPaths.feasibilityQuery.result], {
      state: { preventReset: true, startPolling: true },
    });
  }

  /**
   * Navigates to the profile edit page for a specific profile.
   * @param id - The profile ID to edit
   * @returns
   */
  navigateToEditProfile(id: string): void {
    this.router.navigate([`${UrlPaths.queryEditor.feature}`, id]);
  }

  /**
   * Navigates to the feasibility query editor page.
   * @returns
   */
  public navigateToFeasibilityQueryEditor(): void {
    this.router.navigate([UrlPaths.feasibilityQuery.editor]);
  }

  /**
   * Navigates to the feasibility query search page.
   * @returns
   */
  public navigateToFeasibilityQuerySearch(): void {
    this.router.navigate([UrlPaths.feasibilityQuery.search]);
  }

  public navigateToFeasibilityQueryBulkSearch(): void {
    this.router.navigate([UrlPaths.feasibilityQuery.bulkSearch]);
  }

  /**
   * Navigates to the data selection editor page.
   * @returns
   */
  public navigateToDataSelectionEditor(): void {
    this.router.navigate([UrlPaths.dataSelection.editor]);
  }

  /**
   * Navigates to the data selection search page.
   * @returns
   */
  public navigateToDataSelectionSearch(): void {
    this.router.navigate([UrlPaths.dataSelection.search]);
  }

  /**
   * Navigates to the data query cohort definition page.
   * Prevents reset of state.
   * @returns
   */
  public navigateToDataQueryCohortDefinition(): void {
    this.router.navigate([UrlPaths.dataQuery.cohortDefinition], {
      state: { preventReset: true },
    });
  }

  /**
   * Navigates to the data query data selection page.
   * Prevents reset of state.
   * @returns
   */
  public navigateToDataQueryDataSelection(): void {
    this.router.navigate([UrlPaths.dataQuery.dataSelection], {
      state: { preventReset: true },
    });
  }

  /**
   * Navigates to the saved queries page.
   * Prevents reset of state.
   * @returns
   */
  public navigateToSavedQueries(): void {
    this.router.navigate([BasePaths.savedQueries], {
      state: { preventReset: true },
    });
  }
}
