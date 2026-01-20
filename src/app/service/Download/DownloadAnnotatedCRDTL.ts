import { Injectable } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import { AnnotatedStructuredQuery } from 'src/app/model/AnnotatedStructuredQuery/AnnotatedStructuredQuery';
import { AbstractDownloadService } from './AbstractDownload.service';

@Injectable({
  providedIn: 'root',
})
export class DownloadAnnotatedCRDTLService extends AbstractDownloadService {
  constructor(private fileSaverService: FileSaverService) {
    super();
  }

  /**
   * Downloads annotated CRDTL as a JSON file.
   * @param annotatedStructuredQuery - The annotated query to download
   * @param filename - Optional custom filename (without extension)
   */
  public download(filename?: string): void {
    // Not implemented - requires annotatedStructuredQuery parameter
    throw new Error('Use downloadAnnotatedCRDTLAsFile instead');
  }

  public downloadAnnotatedCRDTLAsFile(
    annotatedStructuredQuery: AnnotatedStructuredQuery,
    filename?: string
  ): void {
    const finalFilename = super.createFilename(filename, 'CCDL');
    const blob = super.createTextBlob(JSON.stringify(annotatedStructuredQuery));
    this.fileSaverService.save(blob, `${finalFilename}.json`);
  }
}
