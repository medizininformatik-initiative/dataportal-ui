import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { CriteriaListEntry } from '../../../model/Search/ListEntries/CriteriaListListEntry'
import { Observable } from 'rxjs'
import { SearchTermDetails } from 'src/app/model/Search/SearchDetails/SearchTermDetails'
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

  @Input()
  selectedTableItemId: string

  @Input()
  listItemDetails$: Observable<SearchTermDetails>

  @Output()
  selectedRelative: EventEmitter<CriteriaListEntry> = new EventEmitter()

  constructor() {}

  ngOnInit() {}

  public getSelectedRelative(entry: CriteriaListEntry): void {
    this.selectedRelative.emit(entry)
  }
}
