import { ActivatedRouteSnapshot } from '@angular/router'
import { catchError, map, Observable, of } from 'rxjs'
import { ConsentService } from '../Consent/Consent.service'
import { DataQueryStorageService } from '../DataQuery/DataQueryStorage.service'
import { Injectable, inject } from '@angular/core'
import { NavigationHelperService } from '../NavigationHelper.service'
import { SavedDataQuery } from 'src/app/model/SavedDataQuery/SavedDataQuery'
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service'
import { UiCRTDL } from 'src/app/model/UiCRTDL'

/**
 * This resolver extracts query ID from route parameters, validates it, and loads the corresponding
 * saved query data to initialize the editor state.
 *
 * Used as a route resolver to preload query data before component initialization.
 */
@Injectable({
  providedIn: 'root',
})
export class LoadQueryIntoEditorFromUrlService {
  private dataQueryStorageService = inject(DataQueryStorageService)
  private consentService = inject(ConsentService)
  private snackbarService = inject(SnackbarService)
  private navigationHelper = inject(NavigationHelperService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Main resolver method that orchestrates the query loading process.
   *
   * @param route - The activated route snapshot containing route parameters and query params
   * @returns Observable of the loaded saved query or undefined if loading fails
   */
  resolve(route: ActivatedRouteSnapshot): Observable<UiCRTDL> | undefined {
    this.clearPreviousConsent()
    const queryId = this.extractAndValidateQueryId(route)
    if (queryId === null) {
      return undefined
    }
    return this.loadSavedQuery(queryId)
  }

  /**
   * This prevents consent from previous queries affecting the current query loading.
   * @returns void
   */
  private clearPreviousConsent(): void {
    this.consentService.clearConsent()
  }

  /**
   * Extracts the query ID from route parameters and validates its format and value.
   *
   * @param route - The activated route snapshot containing query parameters
   * @returns The validated query ID as a number, or null if validation fails
   */
  private extractAndValidateQueryId(route: ActivatedRouteSnapshot): number | null {
    const idParam = route.queryParams.id
    if (!idParam) {
      console.warn('No "id" parameter in query string.')
      return null
    }
    return this.parseAndValidateId(idParam)
  }

  /**
   * Ensures the ID is a positive, safe integer.
   * @param idParam - The raw ID parameter value to parse and validate
   * @returns The parsed and validated ID, or null if validation fails
   */
  private parseAndValidateId(idParam: string): number | null {
    const id = Number(idParam)

    if (isNaN(id) || id <= 0 || !Number.isSafeInteger(id)) {
      console.warn(`Invalid "id" parameter: ${idParam}. Must be a positive integer.`)
      return null
    }
    return id
  }

  /**
   * Loads the saved query from storage using the validated query ID.
   *
   * @param queryId - The validated query ID to load
   * @returns Observable that emits the loaded saved query with processed CRTDL data
   */
  private loadSavedQuery(queryId: number): Observable<UiCRTDL> {
    return this.dataQueryStorageService.readDataQueryById(queryId).pipe(
      map((savedQuery: SavedDataQuery) => savedQuery.getCrtdl()),
      catchError((error) => {
        this.snackbarService.displayErrorMessageWithNoCode('Error loading saved query, not found')
        this.navigationHelper.navigateToDataQueryCohortDefinition()
        return of(null)
      })
    )
  }
}
