export interface InterfaceSavedQueryTile {
  id: string
  label: string
  totalNumberOfPatients: number
  comment?: string
  date: string
  ccdl: {
    exists: boolean
    isValid: boolean
  }
  dataExtraction: {
    exists: boolean
    isValid: boolean
  }
}
