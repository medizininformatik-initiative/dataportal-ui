import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Observable } from 'rxjs'
import { SearchbarComponent } from '../../../../../shared/components/search/searchbar.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-criteria-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [SearchbarComponent, ButtonComponent, AsyncPipe, TranslateModule],
})
export class SearchBarComponent {
  @Input() searchText$: Observable<string>
  @Input() searchText = ''
  @Input() resetFilterEnabled$: Observable<boolean>
  @Output() searchChanged = new EventEmitter<string>()
  @Output() filterReset = new EventEmitter<void>()

  public onSearchTextChange(text: string): void {
    this.searchChanged.emit(text)
  }

  public onSearch(): void {
    this.searchChanged.emit(this.searchText)
  }
}
