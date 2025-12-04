import { CreateCRTDLService } from '../Translator/CRTDL/CreateCRDTL.service';
import { CRTDL } from 'src/app/model/CRTDL/DataExtraction/CRTDL';
import { FileSaverService } from 'ngx-filesaver';
import { Injectable } from '@angular/core';
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service';

/**
 * Service for downloading CRDTL (Common Research Data Transfer Language) files.
 * Handles creation and file saving of CRDTL data extraction definitions.
 */
@Injectable({
  providedIn: 'root',
})
export class DownloadCRTDLService {
  constructor(
    private createCRTDLService: CreateCRTDLService,
    private fileSaverService: FileSaverService,
    private snackbarService: SnackbarService
  ) {}

  /**
   * Downloads the CRTDL as a JSON file.
   * Creates the CRTDL, formats it as JSON, and triggers a file download.
   * @param [filename] - Optional custom filename (without extension)
   * @returns
   */
  public download(filename?: string, displaySnackbar: boolean = true): void {
    this.createCRTDLService
      .createCRTDL()
      .subscribe((crtdl) => {
        this.fileSaverService.save(
          this.createFileData(crtdl),
          this.createFilename(filename) + '.json'
        );
        if (displaySnackbar) {
          this.snackbarService.displayInfoMessage('SNACKBAR.SUCCESS.DOWNLOAD_DATAQUERY');
        }
      })
      .unsubscribe();
  }

  /**
   * Creates a filename for the CRDTL file.
   * Uses provided filename or generates one with current date and time.
   * @param [fileName] - Optional custom filename
   * @returns The filename to use (without extension)
   * @private
   */
  private createFilename(fileName?: string): string {
    if (fileName?.length > 0) {
      return fileName;
    } else {
      return this.generateDefaultFilename();
    }
  }

  /**
   * Generates a default filename based on current date and time.
   * Format: 'CRDTL_DD.MM.YYYY_HH-MM-SS'
   * @returns The generated default filename
   * @private
   */
  private generateDefaultFilename(): string {
    const now = new Date();
    const date = now.toLocaleDateString('de-DE');
    const time = now.toLocaleTimeString('de-DE').replace(/:/g, '-');
    return `CRDTL_${date}_${time}`;
  }

  /**
   * Creates a Blob containing the CRDTL data as JSON.
   * @param crdtl - The CRDTL object to convert to file data
   * @returns A Blob containing the JSON-stringified CRDTL data
   * @private
   */
  private createFileData(crdtl: CRTDL): Blob {
    const crdtlString = JSON.stringify(crdtl);
    return new Blob([crdtlString], { type: 'text/plain;charset=utf-8' });
  }
}
