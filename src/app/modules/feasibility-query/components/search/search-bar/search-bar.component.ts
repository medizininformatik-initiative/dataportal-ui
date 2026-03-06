import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'num-criteria-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  @Input() searchText$: Observable<string>;
  @Input() searchText = '';
  @Output() searchChanged = new EventEmitter<string>();

  public onSearchTextChange(text: string): void {
    this.searchChanged.emit(text);
  }

  public onSearch(): void {
    this.searchChanged.emit(this.searchText);
  }
}
