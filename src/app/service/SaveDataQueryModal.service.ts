import { DataQueryStorageService } from './DataQuery/DataQueryStorage.service';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SaveDataQueryModalComponent } from '../shared/components/save-dataquery-modal/save-dataquery-modal.component';
import { SavedUsageStats } from '../model/Types/SavedUsageStats';
import { SnackbarService } from '../shared/service/Snackbar/Snackbar.service';
import { SaveDataModal } from '../shared/models/SaveDataModal/SaveDataModal';

@Injectable({
  providedIn: 'root',
})
export class SaveDataQueryModalService {
  constructor(
    private dialog: MatDialog,
    private dataQueryStorage: DataQueryStorageService,
    private snackbarService: SnackbarService
  ) {}

  public openSaveDataQueryModal(): Observable<SavedUsageStats> {
    const dialogRef = this.dialog.open(SaveDataQueryModalComponent, {
      disableClose: true,
    });
    return dialogRef.afterClosed().pipe(
      filter((data: SaveDataModal) => !!data),
      switchMap((data) => this.dataQueryStorage.saveDataQuery(data)),
      tap(() => this.snackbarService.displayInfoMessage('SNACKBAR.SUCCESS.SAVED_DATAQUERY'))
    );
  }
}
