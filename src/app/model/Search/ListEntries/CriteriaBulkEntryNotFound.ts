import { AbstractListEntry } from './AbstractListEntry';

export class CriteriaBulkEntryNotFound extends AbstractListEntry {
  private readonly termCode: string;

  constructor(id: string, termCode: string) {
    super(id);
    this.termCode = termCode;
  }

  public getTermCode(): string {
    return this.termCode;
  }
}
