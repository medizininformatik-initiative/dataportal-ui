export abstract class AbstractSelectedField {
  private mustHave = false

  constructor(mustHave: boolean) {
    this.mustHave = mustHave
  }

  public getMustHave(): boolean {
    return this.mustHave
  }

  public setMustHave(mustHave: boolean): void {
    this.mustHave = mustHave
  }
}
