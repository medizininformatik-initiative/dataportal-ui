import { DisplayData } from '../DisplayData'
import { TerminologyCodeData } from '../TerminologyCodeData'
import { ListEntryData } from './ListEntryData'

/**
 * Interface representing individual codeable concept search result entries from backend API responses.
 * Extends base ListEntryData with codeable concept-specific properties including display information
 * and terminology code data. Used for mapping JSON responses to CodeableConceptListEntry domain models.
 */
export interface CodeableConceptResultListEntryData extends ListEntryData {
  /**
   * Display information including original text and translations for this codeable concept
   */
  display: DisplayData

  /**
   * Terminology code data containing system, code, and version information
   */
  termCode: TerminologyCodeData
}
