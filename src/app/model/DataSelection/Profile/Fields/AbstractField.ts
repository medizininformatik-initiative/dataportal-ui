import { Display } from '../Display';

export abstract class AbstractField {
  private readonly type: string;
  private elementId: string;
  private display: Display;
  private description: Display;
  private isRequired = false;
  private recommended = false;
  private deprecated = false;

  constructor(
    elementId: string,
    display: Display,
    description: Display,
    isRequired: boolean = false,
    recommended: boolean,
    deprecated: boolean = false,
    type: string
  ) {
    this.elementId = elementId;
    this.display = display;
    this.description = description;
    this.isRequired = isRequired;
    this.recommended = recommended;
    this.deprecated = deprecated;
    this.type = type;
  }

  public getElementId(): string {
    return this.elementId;
  }

  public setElementId(elementId: string): void {
    this.elementId = elementId;
  }

  public getDisplay(): Display {
    return this.display;
  }

  public setDisplay(value: Display): void {
    this.display = value;
  }

  public getDescription(): Display {
    return this.description;
  }

  public setDescription(value: Display): void {
    this.description = value;
  }

  public getIsRequired(): boolean {
    return this.isRequired;
  }

  public setIsRequired(value: boolean): void {
    this.isRequired = value;
  }

  public getRecommended(): boolean {
    return this.recommended;
  }

  public setRecommended(recommended: boolean): void {
    this.recommended = recommended;
  }

  public getDeprecated(): boolean {
    return this.deprecated;
  }

  public setDeprecated(depricated: boolean): void {
    this.deprecated = depricated;
  }

  public getType(): string {
    return this.type;
  }
}
