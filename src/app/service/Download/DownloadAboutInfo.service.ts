import { AbstractDownloadService } from './AbstractDownload.service'
import { AboutInfoBuilderService } from '../AboutInfo/AboutInfoBuilder.service'
import { Injectable, inject } from '@angular/core'

/**
 * Service for downloading about information as a JSON file.
 * Extends AbstractDownloadService to provide specific about info download functionality.
 */
@Injectable({
  providedIn: 'root',
})
export class DownloadAboutInfoService extends AbstractDownloadService {
  private readonly aboutInfoBuilder = inject(AboutInfoBuilderService)

  private static readonly FILE_PREFIX = 'about-info'
  private static readonly LOCALE_FORMAT = 'iso'
  private static readonly FILE_EXTENSION = '.json'

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    super()
  }

  /**
   * Downloads the about information as a JSON file.
   * @param filename - Optional custom filename (without extension)
   */
  public download(filename?: string): void {
    const aboutInfo = this.aboutInfoBuilder.buildAboutInfo()
    const finalFilename = this.fileName(filename)
    const blob = this.createJsonBlob(aboutInfo)
    this.triggerDownload(blob, `${finalFilename}${DownloadAboutInfoService.FILE_EXTENSION}`)
  }

  private fileName(filename?: string): string {
    return this.createFilename(
      filename,
      DownloadAboutInfoService.FILE_PREFIX,
      DownloadAboutInfoService.LOCALE_FORMAT
    )
  }
}
