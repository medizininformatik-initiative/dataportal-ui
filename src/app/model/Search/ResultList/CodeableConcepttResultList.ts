import { CodeableConceptResultListEntry } from '../ListEntries/CodeableConceptResultListEntry'
import { AbstractResultList } from './AbstractResultList'

export class CodeableConceptResultList extends AbstractResultList<CodeableConceptResultListEntry> {
  constructor(totalHits: number, valueSetEntries: Array<CodeableConceptResultListEntry>) {
    super(totalHits, valueSetEntries)
  }
}
