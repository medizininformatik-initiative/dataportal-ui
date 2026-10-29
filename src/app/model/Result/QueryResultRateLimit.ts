export class QueryResultRateLimit {
  private limit: number
  private remaining: number

  constructor(limit: number, remaining: number) {
    this.limit = limit
    this.remaining = remaining
  }

  public getLimit(): number {
    return this.limit
  }

  public getRemaining(): number {
    return this.remaining
  }

  public setLimit(limit: number): void {
    this.limit = limit
  }

  public setRemaining(remaining: number): void {
    this.remaining = remaining
  }

  public getRemainingCalls(): number {
    return this.limit - this.remaining
  }
}
