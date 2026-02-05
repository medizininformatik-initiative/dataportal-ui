import { AbstractDownloadService } from './AbstractDownload.service';
import { AboutInfoBuilderService } from '../AboutInfo/AboutInfoBuilder.service';
import { Injectable } from '@angular/core';

/**
 * Service for downloading about information as a JSON file.
 * Extends AbstractDownloadService to provide specific about info download functionality.
 */
@Injectable({
  providedIn: 'root',
})
export class DownloadAboutInfoService extends AbstractDownloadService {
  private static readonly FILE_PREFIX = 'about-info';
  private static readonly LOCALE_FORMAT = 'iso';
  private static readonly FILE_EXTENSION = '.json';

  constructor(private readonly aboutInfoBuilder: AboutInfoBuilderService) {
    super();
  }

  /**
   * Downloads the about information as a JSON file.
   * @param filename - Optional custom filename (without extension)
   */
  public download(filename?: string): void {
    const aboutInfo = this.aboutInfoBuilder.buildAboutInfo();
    const finalFilename = this.createFilename(
      filename,
      DownloadAboutInfoService.FILE_PREFIX,
      DownloadAboutInfoService.LOCALE_FORMAT
    );
    const blob = this.createJsonBlob(aboutInfo);
    this.triggerDownload(blob, `${finalFilename}${DownloadAboutInfoService.FILE_EXTENSION}`);
  }
}
