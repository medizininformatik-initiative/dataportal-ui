import { Display } from '../../DataSelection/Profile/Display'
import { CloneTranslations } from './CloneTranslations'

export class CloneDisplayData {
  public static deepCopyDisplayData(displayData: Display): Display {
    const original = displayData.getOriginal()
    const translations = CloneTranslations.deepCopyTranslations(displayData.getTranslations())
    return new Display(translations, original)
  }
}
