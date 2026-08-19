import { Component, OnInit, input, output } from '@angular/core'
import { CriteriaListEntry } from '../../../model/Search/ListEntries/CriteriaListListEntry'
import { Observable } from 'rxjs'
import { CriteriaEntryDetails } from 'src/app/model/Search/EntryDetails/Criteria/CriteriaEntryDetails'
import { MatTabGroup, MatTab, MatTabLabel } from '@angular/material/tabs'
import { NgClass, AsyncPipe } from '@angular/common'
import { MatTooltip } from '@angular/material/tooltip'
import { ListItemDetailsSectionsComponent } from './list-item-details-sections/list-item-details-sections.component'
import { TranslateModule } from '@ngx-translate/core'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-list-item-details',
  templateUrl: './list-item-details.component.html',
  styleUrls: ['./list-item-details.component.scss'],
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    MatTabLabel,
    NgClass,
    MatTooltip,
    ListItemDetailsSectionsComponent,
    AsyncPipe,
    TranslateModule,
    DisplayTranslationPipe,
  ],
})

/**
 * Needs a function to call the elastic search service for fetching the the data when
 * on click of parents/children/siblings
 */
export class ListItemDetailsComponent implements OnInit {
  isOpen = false

  readonly selectedTableItemId = input<string>(undefined)

  readonly listItemDetails$ = input<Observable<CriteriaEntryDetails>>(undefined)

  readonly selectedRelative = output<CriteriaListEntry>()

  constructor() {}

  ngOnInit() {}

  public getSelectedRelative(entry: CriteriaListEntry): void {
    this.selectedRelative.emit(entry)
  }
}
