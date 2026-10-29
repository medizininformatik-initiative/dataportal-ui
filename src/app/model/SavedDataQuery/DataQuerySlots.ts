export class DataQuerySlots {
  private used: number
  private total: number

  constructor(used: number, total: number) {
    this.used = used
    this.total = total
  }

  public getUsed(): number {
    return this.used
  }

  public setUsed(value: number): void {
    this.used = value
  }

  public getTotal(): number {
    return this.total
  }

  public setTotal(value: number): void {
    this.total = value
  }
}
