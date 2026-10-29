import { Component, OnDestroy, OnInit, inject, input } from '@angular/core'
import { Subscription } from 'rxjs'
import { CodeableConceptSearchService } from 'src/app/service/Search/SearchTypes/CodeableConcept/CodeableConceptSearch.service'
import { SearchbarComponent } from '../../../../../shared/components/search/searchbar.component'

@Component({
  selector: 'num-search-concept',
  templateUrl: './search-concept.component.html',
  styleUrls: ['./search-concept.component.scss'],
  standalone: true,
  imports: [SearchbarComponent],
})
export class SearchConceptComponent implements OnDestroy, OnInit {
  private readonly conceptFilterSearchService = inject(CodeableConceptSearchService)

  public readonly valueSetUrl = input.required<string[]>()

  public readonly conceptFilterId = input<string>()

  private searchSubscription: Subscription | undefined

  constructor() {}

  public ngOnInit(): void {
    this.startSearch(' ')
  }

  public ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe()
    }
  }

  public startSearch(searchtext: string): void {
    this.searchSubscription?.unsubscribe()
    this.searchSubscription = this.conceptFilterSearchService.search(searchtext, this.valueSetUrl()).subscribe()
  }
}
