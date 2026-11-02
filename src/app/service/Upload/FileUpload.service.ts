import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export abstract class FileUploadService {
  constructor() {}

  /**
   * Reads the file as text and passes the result to the callback.
   * @param {File} file
   * @param {(result: string | ArrayBuffer | null) => void} onLoadCallback
   */
  public readFile(file: File, onLoadCallback: (result: string | ArrayBuffer | null) => void): void {
    const reader = new FileReader()
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result
      onLoadCallback(result)
    }
    reader.readAsText(file)
  }
}
