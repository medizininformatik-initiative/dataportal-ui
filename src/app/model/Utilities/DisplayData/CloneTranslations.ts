import { Translation } from '../../DataSelection/Profile/Translation'

export class CloneTranslations {
  public static deepCopyTranslations(translations: Translation[]): Translation[] {
    return translations.map((t) => new Translation(t.getLanguage(), t.getValue()))
  }
}
