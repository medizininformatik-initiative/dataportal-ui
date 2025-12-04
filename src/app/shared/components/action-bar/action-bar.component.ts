import { CCDLUploadService } from 'src/app/service/Upload/CCDLUpload.service';
import { Component, Input, OnInit } from '@angular/core';
import { DownloadCRTDLComponent } from '../download-crtdl/download-crtdl.component';
import { FeasibilityQueryValidationService } from 'src/app/service/Criterion/FeasibilityQueryValidation.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SaveDataQueryModalService } from 'src/app/service/SaveDataQueryModal.service';
import { SnackbarHelperService } from 'src/app/service/SnackbarHelper.service';
import { map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'num-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent implements OnInit {
  @Input() showUpload = true;
  @Input() showDownload = true;
  @Input() showSave = true;

  downloadAllowed$: Observable<boolean>;

  downloadSubscription: Subscription;
  saveDataQueryModalSubscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private saveDataQueryModalService: SaveDataQueryModalService,
    private snackbarHelperService: SnackbarHelperService,
    private ccdlUploadService: CCDLUploadService,
    private feasibilityQueryValidationService: FeasibilityQueryValidationService
  ) {}

  ngOnInit(): void {
    this.canDownload();
  }

  public upload(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files[0];
    this.ccdlUploadService.uploadCRTDL(file);
  }

  private canDownload(): void {
    this.downloadAllowed$ = this.feasibilityQueryValidationService
      .getIsFeasibilityQueryValid()
      .pipe(map((isValid) => isValid && this.showDownload));
    this.downloadAllowed$.subscribe((bla) => console.log(bla));
  }

  public downloadCRDTL(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.downloadSubscription?.unsubscribe();
    this.downloadSubscription = this.dialog
      .open(DownloadCRTDLComponent, dialogConfig)
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
