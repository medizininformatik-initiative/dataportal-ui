import { AnnotatedStructuredQuery } from 'src/app/model/AnnotatedStructuredQuery/AnnotatedStructuredQuery';
import { Component, Inject } from '@angular/core';
import { DownloadCRTDLService } from 'src/app/service/Download/DownloadCRDTL.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SaveFileDataModal } from '../../models/SaveDataModal/SaveFileDataModal';
import { SaveQueryModalComponent } from 'src/app/modules/feasibility-query/components/result/save-dialog/save-dialog.component';

@Component({
  selector: 'num-download-crtdl',
  templateUrl: './download-crtdl.component.html',
  styleUrls: ['./download-crtdl.component.scss'],
})
export class DownloadCRTDLComponent {
  constructor(
    private dialogRef: MatDialogRef<SaveQueryModalComponent, void>,
    @Inject(MAT_DIALOG_DATA) public annotatedStructuredQuery: AnnotatedStructuredQuery,
    private downloadCRTDLService: DownloadCRTDLService
  ) {}

  public downloadCRTDL(data: SaveFileDataModal) {
    this.downloadCRTDLService.download(data.title);
    this.doDiscard();
  }

  public doDiscard(): void {
    this.dialogRef.close();
  }
}
