import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ProfileReferenceAdapter } from 'src/app/shared/models/TreeNode/Adapter/ProfileReferenceAdapter'
import { TreeNode } from 'src/app/shared/models/TreeNode/TreeNodeInterface'
import { ModalWindowComponent } from '../../../../../../../shared/components/modal-window/modal-window.component'
import { TreeComponent } from '../../../../../../../shared/components/tree/tree.component'
export class ProfileReferenceModalComponentData {
  referenceUrls: string[]
  profileId: string
}
@Component({
  selector: 'num-profile-reference-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile-reference-modal.component.html',
  styleUrls: ['./profile-reference-modal.component.scss'],
  standalone: true,
  imports: [ModalWindowComponent, TreeComponent],
})
export class ProfileReferenceModalComponent implements OnInit {
  urlTree: TreeNode[] = []

  selectedProfileIds: Set<string> = new Set()

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ProfileReferenceModalComponentData,
    private dialogRef: MatDialogRef<ProfileReferenceModalComponentData, string[]>
  ) {}

  ngOnInit(): void {
    this.selectedProfileIds.clear()
    this.initializeUrlTree()
  }

  private initializeUrlTree(): void {
    this.urlTree = ProfileReferenceAdapter.adapt(this.data.referenceUrls)
  }

  public closeDialog() {
    this.dialogRef.close([])
  }

  public setSelectedReferenceFields(selectedProfile: TreeNode) {
    const url = selectedProfile.originalEntry
    if (this.selectedProfileIds.has(url)) {
      this.selectedProfileIds.delete(url)
    } else {
      this.selectedProfileIds.add(selectedProfile.originalEntry)
    }
  }

  public saveProfileReferences() {
    const urls = Array.from(this.selectedProfileIds)
    this.dialogRef.close(urls)
  }
}
