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
  public readonly profile = input<DataSelectionProfile>()
  public readonly searchTerm = input<string | undefined>(undefined)

  public readonly label = computed(() => this.profile()?.getLabel())
  public readonly display = computed(() => this.profile()?.getDisplay().getOriginal())
  public readonly labelNumber = computed(() => (this.profile()?.getLabelNumber() > 0 ? '(' + this.profile()?.getLabelNumber() + ')' : ''))
  public displayExpanded = false
}
