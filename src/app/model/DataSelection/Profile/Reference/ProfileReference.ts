export class ProfileReference {
  private includeReferenceOnly = false
  private isReferenceSet = false

  constructor(includeReferenceOnly: boolean, isReferenceSet: boolean) {
    this.includeReferenceOnly = includeReferenceOnly
    this.isReferenceSet = isReferenceSet
  }

  public getIncludeReferenceOnly(): boolean {
    return this.includeReferenceOnly
  }

  public setIncludeReferenceOnly(includeRefrenceOnly: boolean): void {
    this.includeReferenceOnly = includeRefrenceOnly
  }

  public getIsReferenceSet(): boolean {
    return this.isReferenceSet
  }

  public setIsReferenceSet(isReferenceSet: boolean): void {
    this.isReferenceSet = isReferenceSet
  }
}
