import { Injectable, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { filter, Observable, switchMap, tap } from 'rxjs'
import { SavedUsageStats } from '../model/Types/SavedUsageStats'
import { SaveDataQueryModalComponent } from '../shared/components/save-dataquery-modal/save-dataquery-modal.component'
import { SaveDataModal } from '../shared/models/SaveDataModal/SaveDataModal'
import { SnackbarService } from '../shared/service/Snackbar/Snackbar.service'
import { DataQueryStorageService } from './DataQuery/DataQueryStorage.service'

@Injectable({
  providedIn: 'root',
})
export class SaveDataQueryModalService {
  private readonly dialog = inject(MatDialog)
  private readonly dataQueryStorage = inject(DataQueryStorageService)
  private readonly snackbarService = inject(SnackbarService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public openSaveDataQueryModal(): Observable<SavedUsageStats> {
    const dialogRef = this.dialog.open(SaveDataQueryModalComponent, {
      disableClose: true,
    })
    return dialogRef.afterClosed().pipe(
      filter((data: SaveDataModal) => !!data),
      switchMap((data: SaveDataModal) => this.dataQueryStorage.saveDataQuery(data)),
      tap(() => this.snackbarService.displayInfoMessage('SNACKBAR.SUCCESS.SAVED_DATAQUERY'))
    )
  }
}
