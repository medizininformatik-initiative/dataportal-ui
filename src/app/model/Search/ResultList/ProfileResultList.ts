import { AbstractResultList } from './AbstractResultList'
import { ProfileListEntry } from '../ListEntries/ProfileListEntry'

export class ProfileResultList extends AbstractResultList<ProfileListEntry> {
  constructor(totalHits: number, profileEntries: Array<ProfileListEntry>) {
    super(totalHits, profileEntries)
  }
}
