import { Injectable, inject } from '@angular/core'
import { FileSaverService } from 'ngx-filesaver'
import { switchMap, take } from 'rxjs'
import { DataQueryApiService } from '../Backend/Api/DataQueryApi.service'
import { CreateCRTDLService } from '../Translator/CRTDL/CreateCRTDL.service'
import { AbstractDownloadService } from './AbstractDownload.service'

@Injectable({
  providedIn: 'root',
})
export class DownloadCRTDLZipService extends AbstractDownloadService {
  private readonly createCRTDLService = inject(CreateCRTDLService)
  private readonly dataQueryApiService = inject(DataQueryApiService)
  private readonly fileSaverService = inject(FileSaverService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    super()
  }

  public download(filename?: string): void {
    this.createCRTDLService
      .createCRTDL()
      .pipe(
        switchMap((crtdl) => this.dataQueryApiService.postConvertCrtdltToCsv(crtdl)),
        take(1)
      )
      .subscribe((blob) => {
        const finalFilename = super.createFilename(filename, 'CRTDL')
        this.fileSaverService.save(blob, `${finalFilename}.zip`)
      })
  }
}
