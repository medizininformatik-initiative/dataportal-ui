import { DisplayData } from './DisplayData';
import { TerminologyCodeData } from './TerminologyCodeData';

/**
 * Interface representing concept data from backend API responses.
 * Combines display information with terminology code data to represent medical or clinical concepts.
 * Used for mapping JSON responses containing concept definitions to domain models.
 */
export interface ConceptData {
  /**
   * Hash made from code + system uuid3 namespace 00000000-0000-0000-0000-000000000000
   */
  id: string
  /**
   * Display information including original text and translations for the concept
   */
  display: DisplayData

  /**
   * Terminology code data containing system, code, version, and display information
   */
  terminologyCode: TerminologyCodeData

  termCode?: TerminologyCodeData
}
