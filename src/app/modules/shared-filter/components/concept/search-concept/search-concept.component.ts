import { Component, OnDestroy, OnInit, inject, input } from '@angular/core'
import { Subscription } from 'rxjs'
import { CodeableConceptResultList } from 'src/app/model/Search/ResultList/CodeableConcepttResultList'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
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
  private conceptFilterSearchService = inject(CodeableConceptSearchService)

  readonly valueSetUrl = input<string[]>()

  readonly conceptFilterId = input<string>()

  private searchSubscription: Subscription
  public searchResults: CodeableConceptResultList

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit(): void {
    this.startElasticSearch(' ')
  }
  /**
   * Initiates a search and handles the results.
   *
   * @param searchtext The text to search for.
   */
  public startElasticSearch(searchtext: string): void {
    this.searchSubscription?.unsubscribe()
    this.searchSubscription = this.conceptFilterSearchService
      .search(searchtext, this.valueSetUrl())
      .subscribe(
        (result) => {
          this.searchResults = result
        },
        (error) => {
          console.error('Search error:', error)
        }
      )
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe()
    }
  }
}
