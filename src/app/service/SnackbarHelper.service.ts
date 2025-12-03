import { Injectable } from '@angular/core';
import { SnackbarService } from '../shared/service/Snackbar/Snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class SnackbarHelperService {
  constructor(private snackbarService: SnackbarService) {}

  /**
   * Displays message when item is added to stage
   */
  public displayAddedToCriteriaStage(): void {
    this.snackbarService.displayInfoMessage('FEASIBILITY.SEARCH.SNACKBAR.ADDED_TO_STAGE');
  }

  /**
   * Displays message when item is removed from stage
   */
  public displayRemovedFromCriteriaStage(): void {
    this.snackbarService.displayErrorMessageWithNoCode(
      'FEASIBILITY.SEARCH.SNACKBAR.REMOVED_FROM_STAGE'
    );
  }

  /**
   * Displays success message for query save
   */
  public displayDataDefinitionSaveSuccess(): void {
    this.snackbarService.displayInfoMessage('FEASIBILITY.EDITOR.SUCCESS.SAVE');
  }

  /**
   * Displays success message for saved query deletion
   */
  public displaySavedQueryDeleteSuccess(): void {
    this.snackbarService.displayInfoMessage('SAVEDQUERIES.SUCCESS.DELETE');
  }

  /**
   * Displays success message for query execution
   */
  public displayFeasibilityExecutionSuccess(): void {
    this.snackbarService.displayInfoMessage('FEASIBILITY.EDITOR.SUCCESS.EXECUTE');
  }

  public dataDefinitionUploadError(): void {
    this.snackbarService.displayErrorMessageWithNoCode('DATAQUERY.DATASELECTION.ERROR.UPLOAD');
  }

  public dataDefinitionUploadSuccess(): void {
    this.snackbarService.displayInfoMessage('DATAQUERY.DATASELECTION.SUCCESS.UPLOAD');
  }
}
