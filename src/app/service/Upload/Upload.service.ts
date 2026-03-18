import { CheckAndUpgradeCCDLService } from '../Upgrade/CheckAndUpgradeCCDL.service';
import { CRTDLData } from 'src/app/model/Interface/CRTDLData';
import { CrtdlProcessingPipelineService } from '../CrtdlProcessingPipeline.service';
import { FileUploadService } from './FileUpload.service';
import { Injectable } from '@angular/core';
import { SnackbarMessageService } from '../SnackbarMessage.service';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(
    private fileUploadService: FileUploadService,
    private snackbarMessageService: SnackbarMessageService,
    private checkAndUpgradeCCDLService: CheckAndUpgradeCCDLService,
    private crtdlProcessingPipelineService: CrtdlProcessingPipelineService
  ) {}

  public uploadCRTDL(file: File): void {
    if (file) {
      this.fileUploadService.readFile(file, this.onReaderLoad.bind(this));
    }
  }

  private onReaderLoad(result: string | ArrayBuffer | null): void {
    const importedQuery = JSON.parse(result as string);
    this.uploadAndTranslate(importedQuery);
  }

  public uploadAndTranslate(crtdl: CRTDLData): void {
    const preUpgraded = this.checkAndUpgradeCCDLService.checkAndUpgradeCCDL(crtdl);
    this.crtdlProcessingPipelineService.process(preUpgraded).subscribe(() => {
      this.snackbarMessageService.dataDefinitionUploadSuccess();
    });
  }
}
