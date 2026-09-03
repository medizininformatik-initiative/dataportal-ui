import { Component, computed, input } from '@angular/core'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DisplayTranslationPipe } from 'src/app/shared/pipes/DisplayTranslationPipe'
import { HighlightPipe } from 'src/app/shared/pipes/HighlightPipe'

@Component({
  selector: 'num-label-col',
  templateUrl: './label-col.component.html',
  standalone: true,
  imports: [DisplayTranslationPipe, HighlightPipe],
})
export class LabelColComponent {
  readonly profile = input<DataSelectionProfile>()
  readonly searchTerm = input<string | undefined>(undefined)

  readonly label = computed(() => this.profile()?.getLabel())
  readonly display = computed(() => this.profile()?.getDisplay().getOriginal())
  readonly labelNumber = computed(() =>
    this.profile()?.getLabelNumber() > 0 ? '(' + this.profile()?.getLabelNumber() + ')' : ''
  )
  displayExpanded = false
}
