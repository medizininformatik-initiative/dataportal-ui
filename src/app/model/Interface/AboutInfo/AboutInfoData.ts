import { BackendInfoData } from './BakcendInfoData';
import { OntologyInfoData } from './OntologyInfoData';
import { UiInfoData } from './UiInfoData';

export interface AboutInfoData {
  backend: BackendInfoData
  ontology: OntologyInfoData
  timestamp: string
  ui: UiInfoData
}
