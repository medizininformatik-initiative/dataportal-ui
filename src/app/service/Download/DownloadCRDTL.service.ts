import { AbstractDownloadService } from './AbstractDownload.service';
import { CreateCRTDLService } from '../Translator/CRTDL/CreateCRDTL.service';
import { FileSaverService } from 'ngx-filesaver';
import { Injectable } from '@angular/core';

/**
 * Service for downloading CRDTL (Common Research Data Transfer Language) files.
 * Handles creation and file saving of CRDTL data extraction definitions.
 */
@Injectable({
  providedIn: 'root',
})
export class DownloadCRTDLService extends AbstractDownloadService {
  constructor(
    private createCRTDLService: CreateCRTDLService,
    private fileSaverService: FileSaverService
  ) {
    super();
  }

  /**
   * Downloads the CRTDL as a JSON file.
   * Creates the CRTDL, formats it as JSON, and triggers a file download.
   * @param [filename] - Optional custom filename (without extension)
   * @param [displaySnackbar] - Whether to display a snackbar notification
   */
  public download(filename?: string): void {
    this.createCRTDLService
      .createCRTDL()
      .subscribe((crtdl) => {
        const finalFilename = super.createFilename(filename, 'CRDTL');
        const blob = super.createTextBlob(JSON.stringify(crtdl));
        this.fileSaverService.save(blob, `${finalFilename}.json`);
      })
      .unsubscribe();
  }
}
