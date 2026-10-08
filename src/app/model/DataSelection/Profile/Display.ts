import { DisplayData } from '../../Interface/DisplayData'
import { TranslationData } from '../../Interface/TranslationData'
import { Translation } from './Translation'

export class Display {
  private originals: string[]
  private original: string
  private translations: Translation[]

  constructor(translations: Translation[], original?: string, originals: string[] = []) {
    this.original = original
    this.originals = originals
    this.translations = translations
  }

  public getOriginal(): string {
    return this.original
  }

  public setOriginal(orginal: string): string {
    return (this.original = orginal)
  }

  /** original + every translation value, trailing whitespace removed */
  public getTexts(): string[] {
    return [this.original, ...this.translations.map((t) => t.getValue())]
      .filter((text) => !!text)
      .map((text) => text.replace(/\s+$/, ''))
  }

  public getOriginals(): string[] {
    return this.originals
  }

  public getTranslations(): Translation[] {
    return this.translations
  }

  /**
   * Translates the original text to the specified language.
   * @param language The target language for translation.
   * @returns The translated text or the original text if no translation is found.
   */
  public translate(language: string): string {
    const translation = this.translations.find((t) => t.getLanguage().split('-')[0] === language)

    // CASE 1: If `originals` exists, we assume it's a list of values
    if (this.originals && this.originals.length > 0) {
      const base = this.originals

      if (translation && translation.getValues()?.length > 0) {
        const merged = base.map((orig, index) => {
          const translated = translation.getValues()[index]
          return translated !== null && translated !== undefined ? translated : orig
        })
        return merged.join(', ')
      }

      return base.join(', ')
    }

    // CASE 2: Single `original` string
    if (this.original) {
      if (translation && translation.getValue()) {
        return translation.getValue() ?? this.original
      }
      return this.original
    }

    return ''
  }

  public static fromJson(json: DisplayData): Display {
    const translations = (json.translations || []).map((translation: TranslationData) =>
      Translation.fromJson(translation)
    )
    return new Display(translations, json.original, [])
  }
}
