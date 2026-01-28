import { Injectable } from '@angular/core';
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service';

@Injectable({
  providedIn: 'root',
})
export abstract class FileUploadService {
  constructor() {}

  public readFile(file: File, onLoadCallback: (result: string | ArrayBuffer | null) => void): void {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result;
      onLoadCallback(result);
    };
    reader.readAsText(file);
  }
}
