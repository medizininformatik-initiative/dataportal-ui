import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { Pipe, PipeTransform } from '@angular/core'
import { TranslateParser, TranslateService } from '@ngx-translate/core'

@Pipe({
  name: 'displayTranslation',
  pure: false,
  standalone: true,
})
export class DisplayTranslationPipe implements PipeTransform {
  constructor(
    private translateService: TranslateService,
    private translateParser: TranslateParser // Inject TranslateParser
  ) {}

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
