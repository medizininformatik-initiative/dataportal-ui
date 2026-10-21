import { SavedDataQueryData } from '../Interface/SavedDataQueryData'
import { CohortDefinitionStatus } from '../Types/CohortDefinitionStatus'
import { DataExtractionStatus } from '../Types/DataExtractionStatus'
import { UiCRTDL } from '../UiCRTDL'

export class SavedDataQuery {
  private crtdl: UiCRTDL
  private comment: string
  private label: string
  private totalNumberOfPatients?: number
  private cohortDefinitionStatus: CohortDefinitionStatus
  private dataExtractionStatus: DataExtractionStatus

  constructor(
    crtdl: UiCRTDL,
    comment: string,
    label: string,
    totalNumberOfPatients: number,
    cohortDefinitionStatus: CohortDefinitionStatus,
    dataExtractionStatus: DataExtractionStatus
  ) {
    this.crtdl = crtdl
    this.comment = comment
    this.label = label
    this.totalNumberOfPatients = totalNumberOfPatients
    this.cohortDefinitionStatus = cohortDefinitionStatus
    this.dataExtractionStatus = dataExtractionStatus
  }

  public getComment(): string {
    return this.comment
  }

  public setComment(comment: string): void {
    this.comment = comment
  }

  public getLabel(): string {
    return this.label
  }

  public setLabel(label: string): void {
    this.label = label
  }

  public getTotalNumberOfPatients(): number {
    return this.totalNumberOfPatients
  }

  public setTotalNumberOfPatients(totalNumberOfPatients: number): void {
    this.totalNumberOfPatients = totalNumberOfPatients
  }

  public getCrtdl(): UiCRTDL {
    return this.crtdl
  }

  public setCrtdl(crtdl: UiCRTDL): void {
    this.crtdl = crtdl
  }

  public getCohortDefinitionStatus(): CohortDefinitionStatus {
    return this.cohortDefinitionStatus
  }

  public setCohortDefinitionStatus(cohortDefinitionStatus: CohortDefinitionStatus): void {
    this.cohortDefinitionStatus = cohortDefinitionStatus
  }

  public getDataExtractionStatus(): DataExtractionStatus {
    return this.dataExtractionStatus
  }

  public setDataExtractionStatus(dataExtractionStatus: DataExtractionStatus): void {
    this.dataExtractionStatus = dataExtractionStatus
  }

  public static fromJson(json: SavedDataQueryData, crtdl: UiCRTDL): SavedDataQuery {
    return new SavedDataQuery(
      crtdl,
      json.comment,
      json.label,
      json.resultSize,
      json.ccdl,
      json.dataExtraction
    )
  }
}
