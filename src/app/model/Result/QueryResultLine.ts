import { QueryResultLineData } from '../Interface/QueryResultLineData'

export class QueryResultLine {
  private numberOfPatients: number
  private siteName: string

  constructor(numberOfPatients: number, siteName: string) {
    this.numberOfPatients = numberOfPatients
    this.siteName = siteName
  }

  public getNumberOfPatients(): number {
    return this.numberOfPatients
  }

  public setNumberOfPatients(value: number): void {
    this.numberOfPatients = value
  }

  public getSiteName(): string {
    return this.siteName
  }

  public setSiteName(value: string): void {
    this.siteName = value
  }

  public static fromJson(json: QueryResultLineData): QueryResultLine {
    return new QueryResultLine(json.numberOfPatients, json.siteName)
  }
}
