export abstract class AbstractValidationIssueInfo {
  private readonly code: string;
  private readonly message: string;

  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }

  public getCode(): string {
    return this.code;
  }

  public getMessage(): string {
    return this.message;
  }

  public static fromJSON(json: any): AbstractValidationIssueInfo {
    return new (class extends AbstractValidationIssueInfo {})(json.code, json.message);
  }
}
