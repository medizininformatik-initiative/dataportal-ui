import { CheckAndUpgradeCCDLService } from '../CheckAndUpgradeCCDL.service';
import { CRTDL2UIModelService } from '../Translator/CRTDL/CRTDL2UIModel.service';
import { CRTDLData } from 'src/app/model/Interface/CRTDLData';
import { CRTDLValidationService } from '../Validation/CRTDLValidation.service';
import { FileUploadService } from './FileUpload.service';
import { filter, switchMap, take } from 'rxjs';
import { Injectable } from '@angular/core';
import { SnackbarMessageService } from '../SnackbarMessage.service';
import { TypeAssertion } from '../TypeGuard/TypeAssersations';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(
    private fileUploadService: FileUploadService,
    private crtdlValidationService: CRTDLValidationService,
    private crdtlTranslatorService: CRTDL2UIModelService,
    private snackbarMessageService: SnackbarMessageService,
    private checkAndUpgradeCCDLService: CheckAndUpgradeCCDLService
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

  /**
   * Uploads the CRTDL after successful validation
   * @param crtdl
   */
  private uploadAndTranslate(crtdl: CRTDLData): void {
    const upgraded = this.checkAndUpgradeCCDLService.checkAndUpgradeCCDL(crtdl);
    this.crtdlValidationService
      .validate(upgraded)
      .pipe(
        filter((isValid) => isValid),
        switchMap(() => this.crdtlTranslatorService.createCRTDLFromJson(upgraded)),
        take(1)
      )
      .subscribe(() => {
        this.snackbarMessageService.dataDefinitionUploadSuccess();
      });
  }
}
