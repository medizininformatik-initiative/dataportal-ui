import { CodeableConceptBulkEntry } from '../ListEntries/CodeableConceptBulkEntry';
import { CodeableConceptBulkSearchResponse } from '../../Interface/CodeableConceptBulkSearchResponse';
import { CriteriaBulkEntryNotFound } from '../ListEntries/CriteriaBulkEntryNotFound';

export class CodeableConceptBulkResultList {
  private found: CodeableConceptBulkEntry[];
  private notFound: CriteriaBulkEntryNotFound[];

  constructor(found: CodeableConceptBulkEntry[], notFound: CriteriaBulkEntryNotFound[]) {
    this.found = found;
    this.notFound = notFound;
  }

  /**
   * Returns the list of found codeable concepts.
   * @returns
   */
  public getFound(): CodeableConceptBulkEntry[] {
    return this.found;
  }

  /**
   * Returns the list of search terms that were not found.
   * @returns
   */
  public getNotFound(): CriteriaBulkEntryNotFound[] {
    return this.notFound;
  }

  public static fromJson(json: CodeableConceptBulkSearchResponse): CodeableConceptBulkResultList {
    const foundEntries = json.found.map((entryJson) => CodeableConceptBulkEntry.fromJson(entryJson));
    const notFoundEntries = json.notFound.map(
      (termCode) => new CriteriaBulkEntryNotFound(termCode, termCode)
    );
    return new CodeableConceptBulkResultList(foundEntries, notFoundEntries);
  }
}
