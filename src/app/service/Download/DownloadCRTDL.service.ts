import { Injectable, inject } from '@angular/core'
import { FileSaverService } from 'ngx-filesaver'
import { CRTDL } from 'src/app/model/CRTDL/DataExtraction/CRTDL'
import { CreateCRTDLService } from '../Translator/CRTDL/CreateCRTDL.service'
import { AbstractDownloadService } from './AbstractDownload.service'

/**
 * Service for downloading CRTDL (Common Research Data Transfer Language) files.
 * Handles creation and file saving of CRTDL data extraction definitions.
 */
@Injectable({
  providedIn: 'root',
})
export class DownloadCRTDLService extends AbstractDownloadService {
  private readonly createCRTDLService = inject(CreateCRTDLService)
  private readonly fileSaverService = inject(FileSaverService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    super()
  }

  /**
   * Downloads the CRTDL as a JSON file.
   * Creates the CRTDL, formats it as JSON, and triggers a file download.
   * @param {string} filename - Optional custom filename (without extension)
   */
  public download(filename?: string): void {
    this.createCRTDLService
      .createCRTDL()
      .subscribe((crtdl: CRTDL) => {
        const finalFilename = super.createFilename(filename, 'CRDTL')
        const blob = super.createTextBlob(JSON.stringify(crtdl))
        this.fileSaverService.save(blob, `${finalFilename}.json`)
      })
      .unsubscribe()
  }
}
