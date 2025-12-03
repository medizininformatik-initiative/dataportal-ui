import { Component } from '@angular/core';
import { DownloadCRDTLService } from 'src/app/service/Download/DownloadCRDTL.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SaveFileDataModal } from '../../../../../shared/models/SaveDataModal/SaveFileDataModal';

@Component({
  selector: 'num-download-data-selection',
  templateUrl: './download-data-selection.component.html',
  styleUrls: ['./download-data-selection.component.scss'],
})
export class DownloadDataSelectionComponent {
  constructor(
    private dialogRef: MatDialogRef<DownloadDataSelectionComponent, boolean>,
    private downloadCRDTLService: DownloadCRDTLService
  ) {}

  public downloadDataSelection(data: SaveFileDataModal) {
    this.downloadCRDTLService.download(data.title);
    this.doDiscard(false);
  }

  public doDiscard(isCancelled: boolean): void {
    this.dialogRef.close(isCancelled);
  }
}
