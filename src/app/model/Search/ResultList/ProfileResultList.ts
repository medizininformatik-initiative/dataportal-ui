import { ProfileListEntry } from '../ListEntries/ProfileListEntry'
import { AbstractResultList } from './AbstractResultList'

export class ProfileResultList extends AbstractResultList<ProfileListEntry> {
  constructor(totalHits: number, profileEntries: Array<ProfileListEntry>) {
    super(totalHits, profileEntries)
  }
}
