import { TranslationData } from '../../Interface/TranslationData'

export class Translation {
  private language: string
  private value: string
  private values: string[]

  constructor(language: string, value: string = undefined, values?: string[]) {
    this.language = language
    this.value = value
    this.values = values
  }

  public getLanguage(): string {
    return this.language
  }

  public setLangugae(language: string): void {
    this.language = language
  }

  public getValue(): string {
    return this.value
  }

  public setValue(value: string): void {
    this.value = value
  }

  public getValues(): string[] {
    return this.values
  }

  public setValues(values: string[]): void {
    this.values = values
  }

  public static fromJson(json: TranslationData): Translation {
    return new Translation(json.language, json.value, [])
  }
}
