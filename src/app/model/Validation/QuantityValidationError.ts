export class QuantityValidationError {
  selected: string;
  allowed: string[];

  constructor(selected: string, allowed: string[]) {
    this.selected = selected;
    this.allowed = allowed;
  }

  public getSelected(): string {
    return this.selected;
  }

  public getAllowed(): string[] {
    return this.allowed;
  }

  public setSelected(selected: string): void {
    this.selected = selected;
  }

  public setAllowed(allowed: string[]): void {
    this.allowed = allowed;
  }
}
