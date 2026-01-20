import { TerminologyCode } from '../Terminology/TerminologyCode';
import { QuantityValidationError } from './QuantityValidationError';

export class ValidationError {
  private location: string;
  private code: string;
  private message: string;
  private details?: Record<string, unknown>;
  private quantityValidationError?: QuantityValidationError;
  private termcode?: TerminologyCode;
  private valueSets?: string[];
  private criteriaSets?: string[];

  constructor(
    location: string,
    code: string,
    message: string,
    details?: Record<string, unknown>,
    quantityValidationError?: QuantityValidationError,
    termcode?: TerminologyCode,
    criteriaSets?: string[],
    valueSets?: string[]
  ) {
    this.location = location;
    this.code = code;
    this.message = message;
    this.termcode = termcode;
    this.quantityValidationError = quantityValidationError;
    this.valueSets = valueSets;
    this.criteriaSets = criteriaSets;
    if (details) {
      this.details = details;
    }
  }

  public getLocation(): string {
    return this.location;
  }

  public getCode(): string {
    return this.code;
  }

  public getMessage(): string {
    return this.message;
  }

  public getDetails(): Record<string, unknown> | undefined {
    return this.details;
  }

  public getTermcode(): TerminologyCode | undefined {
    return this.termcode;
  }

  public getValueSets(): string[] | undefined {
    return this.valueSets;
  }

  public getQuantityValidationError(): QuantityValidationError | undefined {
    return this.quantityValidationError;
  }

  public getCriteriaSets(): string[] | undefined {
    return this.criteriaSets;
  }

  public setCriteriaSets(criteriaSets: string[]): void {
    this.criteriaSets = criteriaSets;
  }

  public setQuantityValidationError(quantityValidationError: QuantityValidationError): void {
    this.quantityValidationError = quantityValidationError;
  }

  public setTermcode(termcode: TerminologyCode): void {
    this.termcode = termcode;
  }

  public setDetails(details: Record<string, unknown>): void {
    this.details = details;
  }

  public setCode(code: string): void {
    this.code = code;
  }

  public setMessage(message: string): void {
    this.message = message;
  }

  public setLocation(location: string): void {
    this.location = location;
  }
}
