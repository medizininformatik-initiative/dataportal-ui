import { Injectable, inject } from '@angular/core'
import { CodeableConceptResultListEntry } from 'src/app/model/Search/ListEntries/CodeableConceptResultListEntry'
import { CodeableConceptResultList } from 'src/app/model/Search/ResultList/CodeableConcepttResultList'
import { AbstractKeyedSearchEngineService } from '../../../Abstract/Engine/AbstractKeyedSearchEngine.service'
import { SearchEngine } from '../../../SearchEngine'
import { CodeableConceptResultMapperStrategy } from '../Mapper/CodeableConceptResultMapperStrategy'
import { CodeableConceptSearchUrlStrategy } from '../Url/CodeableConceptSearchUrlStrategy'

@Injectable({
  providedIn: 'root',
})
export class CodeableConceptSearchEngineService extends AbstractKeyedSearchEngineService<
  CodeableConceptResultListEntry,
  CodeableConceptResultList
> {
  protected searchEngine: SearchEngine<CodeableConceptResultListEntry, CodeableConceptResultList>

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    const searchEngine = inject<SearchEngine<CodeableConceptResultListEntry, CodeableConceptResultList>>(SearchEngine)

    super(searchEngine)
    this.searchEngine = searchEngine
  }

  protected createUrl(searchText: string, page: number, valueSetUrls: string[]): string {
    return new CodeableConceptSearchUrlStrategy(searchText, valueSetUrls).getSearchUrl(page)
  }

  protected getMapping(): CodeableConceptResultMapperStrategy {
    return new CodeableConceptResultMapperStrategy()
  }
}
