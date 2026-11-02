import { Injectable, inject } from '@angular/core'
import { SnackbarService } from '../shared/service/Snackbar/Snackbar.service'

@Injectable({
  providedIn: 'root',
})
export class SnackbarMessageService {
  private readonly snackbarService = inject(SnackbarService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Displays message when item is added to data selection
   */
  public displayAddedToDataSelection(): void {
    this.snackbarService.displayInfoMessage('DATASELECTION.SNACKBAR.ADDED')
  }

  /**
   * Displays message when item is added to stage
   */
  public displayAddedToCriteriaStage(): void {
    this.snackbarService.displayInfoMessage('FEASIBILITY.SEARCH.SNACKBAR.ADDED_TO_STAGE')
  }

  /**
   * Displays message when item is removed from stage
   */
  public displayRemovedFromCriteriaStage(): void {
    this.snackbarService.displayErrorMessageWithNoCode('FEASIBILITY.SEARCH.SNACKBAR.REMOVED_FROM_STAGE')
  }

  /**
   * Displays success message for query save
   */
  public displayDataDefinitionSaveSuccess(): void {
    this.snackbarService.displayInfoMessage('FEASIBILITY.EDITOR.SUCCESS.SAVE')
  }

  /**
   * Displays success message for saved query deletion
   */
  public displaySavedQueryDeleteSuccess(): void {
    this.snackbarService.displayInfoMessage('SAVEDQUERIES.SUCCESS.DELETE')
  }

  /**
   * Displays success message for query execution
   */
  public displayFeasibilityExecutionSuccess(): void {
    this.snackbarService.displayInfoMessage('FEASIBILITY.EDITOR.SUCCESS.EXECUTE')
  }

  /**
   * Displays error message for data definition upload failure
   */
  public dataDefinitionUploadError(): void {
    this.snackbarService.displayErrorMessageWithNoCode('DATAQUERY.DATASELECTION.ERROR.UPLOAD')
  }

  /**
   * Displays error message for CRTDL validation failure
   */
  public crtdlValidationError(): void {
    this.snackbarService.displayErrorMessageWithNoCode('SNACKBAR.ERROR.UPLOAD')
  }

  /**
   * Displays success message for data definition upload
   */
  public dataDefinitionUploadSuccess(): void {
    this.snackbarService.displayInfoMessage('DATAQUERY.DATASELECTION.SUCCESS.UPLOAD')
  }

  /**
   * Displays success message for data definition download
   */
  public dataDefinitionDownloadSuccess(): void {
    this.snackbarService.displayInfoMessage('DATAQUERY.DATASELECTION.SUCCESS.DOWNLOAD')
  }

  /**
   * Displays success message for criterion edit
   */
  public displayCriterionEditSuccess(): void {
    this.snackbarService.displayInfoMessage('FEASIBILITY.EDITOR.EDIT_SUCCESS')
  }

  /**
   * Shows that the time restriction was applied to all criteria.
   */
  public displayTimeRestrictionAppliedToAll(): void {
    this.snackbarService.displayInfoMessage('FEASIBILITY.EDITOR.SUCCESS.TIME_RESTRICTION_APPLIED')
  }
}
