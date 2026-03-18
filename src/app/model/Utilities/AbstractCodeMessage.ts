export abstract class AbstractCodeMessage {
  private readonly code: string;
  private readonly location: string;
  private readonly message: string;

  constructor(code: string, message: string, location: string) {
    this.code = code;
    this.message = message;
    this.location = location;
  }

  public getCode(): string {
    return this.code;
  }

  public getLocation(): string {
    return this.location;
  }

  public getMessage(): string {
    return this.message;
  }
}
