import { Injectable, inject } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
import { catchError, map, Observable, of } from 'rxjs'
import { SavedDataQuery } from 'src/app/model/SavedDataQuery/SavedDataQuery'
import { UiCRTDL } from 'src/app/model/UiCRTDL'
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service'
import { ConsentService } from '../Consent/Consent.service'
import { DataQueryStorageService } from '../DataQuery/DataQueryStorage.service'
import { NavigationHelperService } from '../NavigationHelper.service'

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
  private readonly dataQueryStorageService = inject(DataQueryStorageService)
  private readonly consentService = inject(ConsentService)
  private readonly snackbarService = inject(SnackbarService)
  private readonly navigationHelper = inject(NavigationHelperService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Main resolver method that orchestrates the query loading process.
   *
   * @param {ActivatedRouteSnapshot} route - The activated route snapshot containing route parameters and query params
   * @returns {Observable<UiCRTDL> | undefined} Observable of the loaded saved query or undefined if loading fails
   */
  public resolve(route: ActivatedRouteSnapshot): Observable<UiCRTDL> | undefined {
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
   * @param {ActivatedRouteSnapshot} route - The activated route snapshot containing query parameters
   * @returns {number | null} The validated query ID as a number, or null if validation fails
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
   * @param {string} idParam - The raw ID parameter value to parse and validate
   * @returns {number | null} The parsed and validated ID, or null if validation fails
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
   * @param {number} queryId - The validated query ID to load
   * @returns {Observable<UiCRTDL>} Observable that emits the loaded saved query with processed CRTDL data
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
