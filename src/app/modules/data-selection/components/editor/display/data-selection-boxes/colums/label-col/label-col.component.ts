import { Component, computed, input } from '@angular/core'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DisplayTranslationPipe } from 'src/app/shared/pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-label-col',
  templateUrl: './label-col.component.html',
  standalone: true,
  imports: [DisplayTranslationPipe],
})
export class LabelColComponent {
  readonly profile = input<DataSelectionProfile>()

  readonly label = computed(() => this.profile()?.getLabel())
  readonly display = computed(() => this.profile()?.getDisplay().getOriginal())
  readonly labelNumber = computed(() =>
    this.profile()?.getLabelNumber() > 0 ? '(' + this.profile()?.getLabelNumber() + ')' : ''
  )
  displayExpanded = false
}
