import { CriteriaListEntry } from '../ListEntries/CriteriaListListEntry'
import { AbstractResultList } from './AbstractResultList'

export class CriteriaResultList extends AbstractResultList<CriteriaListEntry> {
  constructor(totalHits: number, valueSetEntries: Array<CriteriaListEntry>) {
    super(totalHits, valueSetEntries)
  }
}
