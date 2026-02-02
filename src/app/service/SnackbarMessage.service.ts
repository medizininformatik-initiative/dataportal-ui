import { Injectable } from '@angular/core';
import { SnackbarService } from '../shared/service/Snackbar/Snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class SnackbarMessageService {
  constructor(private snackbarService: SnackbarService) {}

  /**
   * Displays message when item is added to data selection
   * @returns
   */
  public displayAddedToDataSelection(): void {
    this.snackbarService.displayInfoMessage('DATASELECTION.SNACKBAR.ADDED');
  }

  /**
   * Displays message when item is added to stage
   * @returns
   */
  public displayAddedToCriteriaStage(): void {
    this.snackbarService.displayInfoMessage('FEASIBILITY.SEARCH.SNACKBAR.ADDED_TO_STAGE');
  }

  /**
   * Displays message when item is removed from stage
   * @return
   */
  public displayRemovedFromCriteriaStage(): void {
    this.snackbarService.displayErrorMessageWithNoCode(
      'FEASIBILITY.SEARCH.SNACKBAR.REMOVED_FROM_STAGE'
    );
  }

  /**
   * Displays success message for query save
   * @returns
   */
  public displayDataDefinitionSaveSuccess(): void {
    this.snackbarService.displayInfoMessage('FEASIBILITY.EDITOR.SUCCESS.SAVE');
  }

  /**
   * Displays success message for saved query deletion
   * @returns
   */
  public displaySavedQueryDeleteSuccess(): void {
    this.snackbarService.displayInfoMessage('SAVEDQUERIES.SUCCESS.DELETE');
  }

  /**
   * Displays success message for query execution
   * @returns
   */
  public displayFeasibilityExecutionSuccess(): void {
    this.snackbarService.displayInfoMessage('FEASIBILITY.EDITOR.SUCCESS.EXECUTE');
  }

  /**
   * Displays error message for data definition upload failure
   * @returns
   */
  public dataDefinitionUploadError(): void {
    this.snackbarService.displayErrorMessageWithNoCode('DATAQUERY.DATASELECTION.ERROR.UPLOAD');
  }

  /**
   * Displays error message for CRTDL validation failure
   * @returns
   */
  public crtdlValidationError(): void {
    this.snackbarService.displayErrorMessageWithNoCode('SNACKBAR.ERROR.UPLOAD');
  }

  /**
   * Displays success message for data definition upload
   * @returns
   */
  public dataDefinitionUploadSuccess(): void {
    this.snackbarService.displayInfoMessage('DATAQUERY.DATASELECTION.SUCCESS.UPLOAD');
  }

  /**
   * Displays success message for data definition download
   * @returns
   */
  public dataDefinitionDownloadSuccess(): void {
    this.snackbarService.displayInfoMessage('DATAQUERY.DATASELECTION.SUCCESS.DOWNLOAD');
  }
}
