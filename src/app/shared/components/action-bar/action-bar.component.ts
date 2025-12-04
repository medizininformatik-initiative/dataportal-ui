import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DownloadDataSelectionComponent } from 'src/app/modules/data-query/data-query/data-selection/download-data-selection/download-data-selection.component';
import { SaveDataQueryModalService } from 'src/app/service/SaveDataQueryModal.service';
import { SnackbarHelperService } from 'src/app/service/SnackbarHelper.service';
import { CCDLUploadService } from 'src/app/service/Upload/CCDLUpload.service';

@Component({
  selector: 'num-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent {
  @Input() showUpload = true;
  @Input() showDownload = true;
  @Input() showSave = true;

  downloadSubscription: Subscription;
  saveDataQueryModalSubscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private saveDataQueryModalService: SaveDataQueryModalService,
    private snackbarHelperService: SnackbarHelperService,
    private ccdlUploadService: CCDLUploadService
  ) {}

  public upload(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files[0];
    this.ccdlUploadService.uploadCRTDL(file);
  }

  public downloadCRDTL(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.downloadSubscription?.unsubscribe();
    this.downloadSubscription = this.dialog
      .open(DownloadDataSelectionComponent, dialogConfig)
      .afterClosed()
      .subscribe((isCancelled: boolean) => {});
  }

  public onSaveDataQuery(): void {
    this.saveDataQueryModalSubscription?.unsubscribe();
    this.saveDataQueryModalSubscription = this.saveDataQueryModalService
      .openSaveDataQueryModal()
      .subscribe();
  }
}
