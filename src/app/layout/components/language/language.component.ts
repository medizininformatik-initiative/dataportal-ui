import { Component, OnInit, inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { TranslateService, TranslateModule } from '@ngx-translate/core'
import { MatFormField, MatPrefix } from '@angular/material/form-field'
import { MatSelect } from '@angular/material/select'
import { MatOption } from '@angular/material/core'
import { NumDataCyDirective } from '../../../shared/directives/num-data-cy.directive'

@Component({
  selector: 'num-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  standalone: true,
  imports: [MatFormField, MatPrefix, MatSelect, MatOption, TranslateModule, NumDataCyDirective],
})
export class LanguageComponent implements OnInit {
  translate = inject(TranslateService)
  private document = inject(DOCUMENT)

  languages: string[] = ['de', 'en']

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    const translate = this.translate

    translate.addLangs(this.languages)
    translate.setDefaultLang('de')

    const browserLang = translate.getBrowserLang()
    translate.use(this.languages.includes(browserLang) ? browserLang : 'de')

    // Keep <html lang> in sync for screen readers and hyphenation
    this.document.documentElement.lang = translate.currentLang
    translate.onLangChange.subscribe(({ lang }) => (this.document.documentElement.lang = lang))
  }

  ngOnInit(): void {}

  public changeLanguage(lang: string) {
    this.translate.use(lang)
  }
}
