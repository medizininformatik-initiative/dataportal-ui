import { AbstractCriterion } from 'src/app/model/FeasibilityQuery/Criterion/AbstractCriterion'
import { Criterion } from '../../../model/FeasibilityQuery/Criterion/Criterion'
import { CriterionProviderService } from '../../Provider/CriterionProvider.service'
import { EditReferenceCriteriaModalComponent } from 'src/app/modules/feasibility-query/components/editor/reference-criteria-modal/edit-reference-criteria-modal.component'
import { Injectable, OnDestroy, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CriterionModalService implements OnDestroy {
  private dialog = inject(MatDialog)
  private criterionProviderService = inject(CriterionProviderService)

  dialogSubscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnDestroy() {
    this.dialogSubscription.unsubscribe()
  }

  public openReferenceCriteriaModal(criterion: Criterion) {
    const dialogRef = this.dialog.open(EditReferenceCriteriaModalComponent, {
      disableClose: true,
      data: { criterion },
    })
    this.dialogSubscription = dialogRef.afterClosed().subscribe((updatedCriterion: Criterion) => {
      if (updatedCriterion) {
        this.criterionProviderService.setOne(updatedCriterion)
      }
    })
  }
}
