import { QuantityUnitData } from '../Interface/Unit'

/**
 * Represents a quantity unit with a code and display name.
 */
export class QuantityUnit {
  private code: string
  private display: string
  private system: string

  /**
   * Constructor to initialize the QuantityUnit with code and display.
   *
   * @param {string} code - The code of the quantity unit.
   * @param {string} display - The display name of the quantity unit.
   * @param {string} system
   */
  constructor(code: string, display: string, system?: string) {
    this.code = code
    this.display = display
    this.system = system
  }

  /**
   * Gets the code of the quantity unit.
   *
   * @returns {string} The code of the quantity unit.
   */
  public getCode(): string {
    return this.code
  }

  /**
   * Sets the code of the quantity unit.
   *
   * @param {string} code - The new code of the quantity unit.
   */
  public setCode(code: string): void {
    this.code = code
  }

  /**
   * Gets the display name of the quantity unit.
   *
   * @returns {string} The display name of the quantity unit.
   */
  public getDisplay(): string {
    return this.display
  }

  /**
   * Sets the display name of the quantity unit.
   *
   * @param {string} display - The new display name of the quantity unit.
   */
  public setDisplay(display: string): void {
    this.display = display
  }

  /**
   * Gets the system name of the quantity unit.
   *
   * @returns {string} The system name of the quantity unit.
   */
  public getSystem(): string {
    return this.system
  }

  /**
   * Sets the system name of the quantity unit.
   *
   * @param {string} system - The new system name of the quantity unit.
   */
  public setSystem(system: string): void {
    this.system = system
  }

  /**
   * Creates a QuantityUnit instance from a JSON object.
   * @param {QuantityUnitData} json
   * @returns {QuantityUnit}
   * @see {@link QuantityUnitData}
   */
  public static fromJson(json: QuantityUnitData): QuantityUnit {
    return new QuantityUnit(json.code, json.display, json?.system)
  }
}
