import { AbstractDownloadService } from './AbstractDownload.service'
import { CreateCRTDLService } from '../Translator/CRTDL/CreateCRTDL.service'
import { FileSaverService } from 'ngx-filesaver'
import { Injectable, inject } from '@angular/core'

/**
 * Service for downloading CRTDL (Common Research Data Transfer Language) files.
 * Handles creation and file saving of CRTDL data extraction definitions.
 */
@Injectable({
  providedIn: 'root',
})
export class DownloadCRTDLService extends AbstractDownloadService {
  private createCRTDLService = inject(CreateCRTDLService)
  private fileSaverService = inject(FileSaverService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    super()
  }

  /**
   * Downloads the CRTDL as a JSON file.
   * Creates the CRTDL, formats it as JSON, and triggers a file download.
   * @param filename - Optional custom filename (without extension)
   */
  public download(filename?: string): void {
    this.createCRTDLService
      .createCRTDL()
      .subscribe((crtdl) => {
        const finalFilename = super.createFilename(filename, 'CRDTL')
        const blob = super.createTextBlob(JSON.stringify(crtdl))
        this.fileSaverService.save(blob, `${finalFilename}.json`)
      })
      .unsubscribe()
  }
}
