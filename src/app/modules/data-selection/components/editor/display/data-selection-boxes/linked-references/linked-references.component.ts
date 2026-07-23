import { Component, computed, effect, input } from '@angular/core'
import { LinkedBadgeComponent } from 'src/app/shared/components/linked-badge/linked-badge.component'
import { ProfileFields } from 'src/app/model/DataSelection/Profile/Fields/ProfileFields'
import { ProfileReferenceTileComponent } from 'src/app/shared/components/profile-reference-tile/profile-reference-tile.component'

@Component({
  selector: 'num-linked-references',
  templateUrl: './linked-references.component.html',
  styleUrls: ['./linked-references.component.scss'],
  standalone: true,
  imports: [LinkedBadgeComponent, ProfileReferenceTileComponent],
})
export class LinkedReferencesComponent {
  readonly fields = input.required<ProfileFields>()
  readonly isEditable = input<boolean>(true)
  readonly profileId = input.required<string>()

  readonly unlinked = computed(
    () => this.fields()?.getUnlinkedRequiredOrRecommendedReferences() ?? []
  )

  readonly selectedReferences = computed(() => this.fields()?.getSelectedReferenceFields() ?? [])

  readonly showBadge = computed(
    () =>
      (this.unlinked().length > 0 && !!this.isEditable()) || this.selectedReferences().length > 0
  )

  constructor() {}
}
