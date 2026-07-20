import { Component, inject, output, signal } from '@angular/core'
import { ProfileSearchService } from 'src/app/service/Search/SearchTypes/Profile/ProfileSearch.service'
import { SearchbarComponent } from 'src/app/shared/components/search/searchbar.component'

@Component({
  selector: 'num-profile-search-bar',
  templateUrl: './profile-search-bar.component.html',
  standalone: true,
  imports: [SearchbarComponent],
})
export class ProfileSearchBarComponent {
  private profileSearchService = inject(ProfileSearchService)

  readonly searchText = signal('')
  readonly searchTextChange = output<string>()

  public onSearchTextChange(text: string): void {
    this.searchText.set(text)
    this.searchTextChange.emit(text)
    this.profileSearchService.search(text).subscribe()
  }
}
