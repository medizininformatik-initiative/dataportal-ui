import { ConceptData } from './ConceptData';

export interface CodeableConceptBulkSearchResponse {
  found: ConceptData[]
  notFound: string[]
}
