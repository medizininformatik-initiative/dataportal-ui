import { Component, input, output } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'

export interface SelectedListItem {
  display: Display
  code: string
}

@Component({
  selector: 'num-selected-items-list',
  templateUrl: './selected-items-list.component.html',
  styleUrls: ['./selected-items-list.component.scss'],
  standalone: true,
  imports: [TranslateModule, DisplayTranslationPipe],
})
export class SelectedItemsListComponent {
  public readonly items = input<SelectedListItem[]>([])

  public readonly removeItem = output<number>()
}
