import { AbstractDownloadService } from './AbstractDownload.service'
import { CreateCRTDLService } from '../Translator/CRTDL/CreateCRTDL.service'
import { DataQueryApiService } from '../Backend/Api/DataQueryApi.service'
import { FileSaverService } from 'ngx-filesaver'
import { Injectable, inject } from '@angular/core'
import { switchMap } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class DownloadCRTDLZipService extends AbstractDownloadService {
  private createCRTDLService = inject(CreateCRTDLService)
  private dataQueryApiService = inject(DataQueryApiService)
  private fileSaverService = inject(FileSaverService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    super()
  }

  public download(filename?: string): void {
    this.createCRTDLService
      .createCRTDL()
      .pipe(switchMap((crtdl) => this.dataQueryApiService.postConvertCrtdltToCsv(crtdl)))
      .subscribe((blob) => {
        const finalFilename = super.createFilename(filename, 'CRTDL')
        this.fileSaverService.save(blob, `${finalFilename}.zip`)
      })
  }
}
