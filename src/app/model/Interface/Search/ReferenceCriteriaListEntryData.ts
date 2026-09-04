import { DisplayData } from '../DisplayData'
import { ListEntryData } from './ListEntryData'

/**
 * Interface representing reference criteria entry data from backend search API responses.
 * Extends base ListEntryData with reference-specific properties including display information,
 * system identifiers, and terminology references. Used for mapping JSON responses to
 * ReferenceCriteriaListEntry domain models.
 */
export interface ReferenceCriteriaListEntryData extends ListEntryData {
  /**
   * Display information including original text and translations for this reference criteria
   */
  display: DisplayData

  /**
   * System identifier indicating the source system or standard for this reference
   */
  system: string

  /**
   * Terminology system name or identifier associated with this reference criteria
   */
  terminology: string

  /**
   * The terminology code
   */
  termcode: string
}
