import { CCDLUploadService } from 'src/app/service/Upload/CCDLUpload.service';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { DataSelectionFactoryService } from 'src/app/service/DataSelection/DataSelection.factory.service';
import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service';
import { DownloadDataSelectionComponent } from '../download-data-selection/download-data-selection.component';
import { FeasibilityQueryValidation } from 'src/app/service/Criterion/FeasibilityQueryValidation.service';
import { map, take } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service';
import { Observable, Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service';

@Component({
  selector: 'num-data-selection-action-bar',
  templateUrl: './data-selection-action-bar.component.html',
  styleUrls: ['./data-selection-action-bar.component.scss'],
})
export class DataSelectionActionBarComponent implements OnDestroy, OnInit {
  isDataSelectionExistent$: Observable<boolean>;
  isCohortExistent$: Observable<boolean>;
  fileName: string;
  private subscription: Subscription;

  downloadSubscription: Subscription;

  mainProfileSubscription: Subscription;

  constructor(
    public elementRef: ElementRef,
    private dataSelectionProviderService: DataSelectionProviderService,
    private navigationHelperService: NavigationHelperService,
    private ccdlUploadService: CCDLUploadService,
    private feasibilityQueryValidation: FeasibilityQueryValidation,
    private dataSelectionFactoryService: DataSelectionFactoryService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.isDataSelectionExistent$ = this.dataSelectionProviderService
      .getActiveDataSelection()
      .pipe(map((dataSelection) => dataSelection.getProfiles().length > 0));

    this.isCohortExistent$ = this.feasibilityQueryValidation.getIsFeasibilityQueryValid();
  }

  ngOnDestroy(): void {
    this.mainProfileSubscription?.unsubscribe();
    this.subscription?.unsubscribe();
  }

  public editDataSelection() {
    this.navigationHelperService.navigateToDataSelectionEditor();
  }

  public createNewDataSelection() {
    this.mainProfileSubscription?.unsubscribe();
    this.dataSelectionFactoryService.instantiate().subscribe();
    this.navigationHelperService.navigateToDataSelectionSearch();
  }

  public downloadCRDTL(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.downloadSubscription?.unsubscribe();
    this.downloadSubscription = this.dialog
      .open(DownloadDataSelectionComponent, dialogConfig)
      .afterClosed()
      .subscribe((isCancelled: boolean) => {
        if (!isCancelled) {
          this.snackbarService.displayInfoMessage('DATAQUERY.DATASELECTION.SUCCESS.DOWNLOAD');
        }
      });
  }

  public uploadCCDL(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files[0];
    this.ccdlUploadService.uploadCCDL(file);
  }

  public navigateToDataQueryCohortDefinition() {
    this.navigationHelperService.navigateToDataQueryCohortDefinition();
  }
}
