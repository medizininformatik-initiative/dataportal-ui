import { Component, computed, effect, input } from '@angular/core'
import { ProfileFields } from 'src/app/model/DataSelection/Profile/Fields/ProfileFields'
import { LinkedBadgeComponent } from 'src/app/shared/components/linked-badge/linked-badge.component'
import { ProfileReferenceTileComponent } from 'src/app/shared/components/profile-reference-tile/profile-reference-tile.component'

@Component({
  selector: 'num-linked-references',
  templateUrl: './linked-references.component.html',
  styleUrls: ['./linked-references.component.scss'],
  standalone: true,
  imports: [LinkedBadgeComponent, ProfileReferenceTileComponent],
})
export class LinkedReferencesComponent {
  public readonly fields = input.required<ProfileFields>()
  public readonly isEditable = input<boolean>(true)
  public readonly profileId = input.required<string>()

  public readonly unlinked = computed(() => this.fields()?.getUnlinkedRequiredOrRecommendedReferences() ?? [])

  public readonly selectedReferences = computed(() => this.fields()?.getSelectedReferenceFields() ?? [])

  public readonly showBadge = computed(() => (this.unlinked().length > 0 && !!this.isEditable()) || this.selectedReferences().length > 0)

  constructor() {}
}
