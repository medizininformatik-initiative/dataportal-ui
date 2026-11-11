export class SavedFeasibilityQueryResults {
  label: string
  comment: string
  totalNumberOfPatients: number

  constructor(label: string, comment: string, totalNumberOfPatients: number) {
    this.label = label
    this.comment = comment
    this.totalNumberOfPatients = totalNumberOfPatients
  }

  public getLabel(): string {
    return this.label
  }

  public getComment(): string {
    return this.comment
  }

  public getTotalNumberOfPatients(): number {
    return this.totalNumberOfPatients
  }

  public setLabel(label: string): void {
    this.label = label
  }

  public setComment(comment: string): void {
    this.comment = comment
  }

  public setTotalNumberOfPatients(totalNumberOfPatients: number): void {
    this.totalNumberOfPatients = totalNumberOfPatients
  }
}
