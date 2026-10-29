import { DataSelection } from './DataSelection/DataSelection'
import { FeasibilityQuery } from './FeasibilityQuery/FeasibilityQuery'

export class UiCRTDL {
  private display = 'http://json-schema.org/to-be-done/schema#'
  private id: string
  private version = ''
  private feasibilityQuery: FeasibilityQuery
  private dataSelection: DataSelection

  constructor(id: string, feasibilityQuery: FeasibilityQuery, dataSelection: DataSelection) {
    this.feasibilityQuery = feasibilityQuery
    this.dataSelection = dataSelection
    this.id = id
  }

  public getId(): string {
    return this.id
  }

  public setId(id: string): void {
    this.id = id
  }

  public getFeasibilityQuery(): FeasibilityQuery {
    return this.feasibilityQuery
  }

  public setFeasibilityQuery(feasibilityQuery: FeasibilityQuery): void {
    this.feasibilityQuery = feasibilityQuery
  }

  public getDataExtraction(): DataSelection {
    return this.dataSelection
  }

  public setDataExtraction(dataSelection: DataSelection): void {
    this.dataSelection = dataSelection
  }

  public getDisplay(): string {
    return this.display
  }

  public setDisplay(display: string): void {
    this.display = display
  }

  public getVersion(): string {
    return this.version
  }

  public setVersion(version: string): void {
    this.version = version
  }
}
