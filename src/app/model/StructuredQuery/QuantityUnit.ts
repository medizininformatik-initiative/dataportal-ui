/**
 * Represents a quantity unit with a code and display name.
 */
export class QuantityUnit {
  private code: string
  private display: string

  /**
   * Constructor to initialize the QuantityUnit with code and display.
   *
   * @param code - The code of the quantity unit.
   * @param display - The display name of the quantity unit.
   */
  constructor(code: string, display: string) {
    this.code = code
    this.display = display
  }

  /**
   * Gets the code of the quantity unit.
   *
   * @returns The code of the quantity unit.
   */
  public getCode(): string {
    return this.code
  }

  /**
   * Sets the code of the quantity unit.
   *
   * @param code - The new code of the quantity unit.
   */
  public setCode(code: string): void {
    this.code = code
  }

  /**
   * Gets the display name of the quantity unit.
   *
   * @returns The display name of the quantity unit.
   */
  public getDisplay(): string {
    return this.display
  }

  /**
   * Sets the display name of the quantity unit.
   *
   * @param display - The new display name of the quantity unit.
   */
  public setDisplay(display: string): void {
    this.display = display
  }
}
