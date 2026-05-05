import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Display } from 'src/app/model/DataSelection/Profile/Display';

export interface SelectedListItem {
  display: Display
  code: string
}

@Component({
  selector: 'num-selected-items-list',
  templateUrl: './selected-items-list.component.html',
  styleUrls: ['./selected-items-list.component.scss'],
})
export class SelectedItemsListComponent {
  @Input() items: SelectedListItem[] = [];

  @Output() removeItem = new EventEmitter<number>();
}
