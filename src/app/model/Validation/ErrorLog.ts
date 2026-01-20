import { ValidationError } from './ValidationError';

export class ErrorLog {
  private status: string;
  private timestamp: Date;
  private errorCount: number;
  private errors: ValidationError[];

  constructor(status: string, errors: ValidationError[]) {
    this.status = status;
    this.timestamp = new Date();
    this.errors = errors;
    this.errorCount = errors.length;
  }

  public getStatus(): string {
    return this.status;
  }

  public getTimestamp(): Date {
    return this.timestamp;
  }

  public getErrorCount(): number {
    return this.errorCount;
  }

  public getErrors(): ValidationError[] {
    return this.errors;
  }

  public setErrors(errors: ValidationError[]): void {
    this.errors = errors;
    this.errorCount = errors.length;
  }

  public setStatus(status: string): void {
    this.status = status;
  }

  public setTimestamp(timestamp: Date): void {
    this.timestamp = timestamp;
  }
}
