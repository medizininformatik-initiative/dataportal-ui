import { TerminologyCodeData } from '../Interface/TerminologyCodeData'

/**
 * @todo check if uid is still needed as a class variable
 */
export class TerminologyCode {
  private code: string
  private display: string
  private system: string
  private version?: string
  private uid?: string

  constructor(code: string, display: string, system: string, version?: string, uid?: string) {
    this.code = code
    this.display = display
    this.system = system
    this.version = version
    this.uid = uid
  }

  /**
   * Method to check wheather a Termonolgy Code already exists
   *
   * @param {TerminologyCode} other
   * @returns {boolean}
   */
  public equals(other: TerminologyCode): boolean {
    return this.code === other.code && this.system === other.system
  }

  /**
   * Getter for the 'code' property.
   *
   * @returns {string} The code of the terminology code.
   */
  public getCode(): string {
    return this.code
  }

  /**
   * Setter for the 'code' property.
   *
   * @param {string} code - The new code to set.
   */
  public setCode(code: string): void {
    this.code = code
  }

  /**
   * Getter for the 'display' property.
   *
   * @returns {string} The display name of the terminology code.
   */
  public getDisplay(): string {
    return this.display
  }

  /**
   * Setter for the 'display' property.
   *
   * @param {string} display - The new display name to set.
   */
  public setDisplay(display: string): void {
    this.display = display
  }

  /**
   * Getter for the 'system' property.
   *
   * @returns {string} The system of the terminology code.
   */
  public getSystem(): string {
    return this.system
  }

  /**
   * Setter for the 'system' property.
   *
   * @param {string} system - The new system to set.
   */
  public setSystem(system: string): void {
    this.system = system
  }

  /**
   * Getter for the 'version' property.
   *
   * @returns {string | undefined} The version of the terminology code.
   */
  public getVersion(): string | undefined {
    return this.version
  }

  /**
   * Setter for the 'version' property.
   *
   * @param {string} version - The new version to set.
   */
  public setVersion(version?: string): void {
    this.version = version
  }

  /**
   * Getter for the 'uid' property.
   *
   * @returns {string | undefined} The UID of the terminology code.
   */
  public getUid(): string | undefined {
    return this.uid
  }

  /**
   * Setter for the 'uid' property.
   *
   * @param {string} uid - The new UID to set.
   */
  public setUid(uid?: string): void {
    this.uid = uid
  }

  /**
   * Creates a TerminologyCode instance from a JSON object.
   *
   * @param {TerminologyCodeData} json The JSON object to convert.
   * @returns {TerminologyCode} The created TerminologyCode instance.
   */
  public static fromJson(json: TerminologyCodeData): TerminologyCode {
    return new TerminologyCode(json.code, json.display, json.system, json.version)
  }
}
