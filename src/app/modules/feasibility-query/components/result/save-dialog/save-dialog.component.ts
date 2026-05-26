import { Component, OnDestroy, OnInit } from '@angular/core'
import { FeasibilityQueryApiService } from 'src/app/service/Backend/Api/FeasibilityQueryApi.service'
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service'
import { MatDialogRef } from '@angular/material/dialog'
import { SaveDataModal } from 'src/app/shared/models/SaveDataModal/SaveDataModal'
import { SaveFeasibilityQueryModalService } from 'src/app/service/SaveFeasibilityQueryModal.service'
import { Subscription } from 'rxjs'
import { SaveFileModalComponent } from '../../../../../shared/components/save-file-modal/save-file-modal.component'

@Component({
  selector: 'num-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss'],
  standalone: true,
  imports: [SaveFileModalComponent],
})
export class SaveQueryModalComponent implements OnInit, OnDestroy {
  private subscriptionResult: Subscription

  constructor(
    public feasibilityQueryProviderService: FeasibilityQueryProviderService,
    public feasibilityQueryApiService: FeasibilityQueryApiService,
    private dialogRef: MatDialogRef<SaveQueryModalComponent, void>,
    private saveFeasibilityQueryModalService: SaveFeasibilityQueryModalService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptionResult?.unsubscribe()
  }

  public doSaveFeasibilityQuery(data: SaveDataModal): void {
    this.subscriptionResult = this.saveFeasibilityQueryModalService
      .saveFeasibilityQuery(data.title, data.comment)
      .subscribe(() => this.doDiscard())
  }

  public doDiscard(): void {
    this.dialogRef.close()
  }
}
