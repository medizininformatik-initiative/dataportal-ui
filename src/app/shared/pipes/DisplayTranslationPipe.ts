import { Pipe, PipeTransform, inject } from '@angular/core'
import { TranslateParser, TranslateService } from '@ngx-translate/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'

@Pipe({
  name: 'displayTranslation',
  pure: false,
  standalone: true,
})
export class DisplayTranslationPipe implements PipeTransform {
  private readonly translateService = inject(TranslateService)
  private readonly translateParser = inject(TranslateParser)

  /** Inserted by Angular inject() migration for backwards compatibility */

  public transform(value: any, params?: any): string {
    if (!value) {
      return ''
    }

    const currentLang = this.translateService.currentLang

    if (value instanceof Display) {
      const translatedValue = value.translate(currentLang)
      return this.translateParser.interpolate(translatedValue, params)
    } else {
      const translatedValue = this.translateService.instant(value)
      return this.translateParser.interpolate(translatedValue, params)
    }
  }
}
