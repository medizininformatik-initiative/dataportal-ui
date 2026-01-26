/* eslint-disable */
import { IssueData } from '../../core/model/Feasibility/IssueData'

export class Issue {
  private message: string
  private type: string
  private code: string
  private severity: string

  constructor(message: string, type: string, code: string, severity: string) {
    this.message = message
    this.type = type
    this.code = code
    this.severity = severity
  }

  public getMessage(): string {
    return this.message
  }

  public setMessage(message: string): void {
    this.message = message
  }

  public getType(): string {
    return this.type
  }

  public setType(type: string): void {
    this.type = type
  }

  public getCode(): string {
    return this.code
  }

  public setCode(code: string): void {
    this.code = code
  }

  public getSeverity(): string {
    return this.severity
  }

  public setSeverity(severity: string): void {
    this.severity = severity
  }

  public static fromJson(json: IssueData): Issue {
    return new Issue(json.message, json.type, json.code, json.severity)
  }
}
